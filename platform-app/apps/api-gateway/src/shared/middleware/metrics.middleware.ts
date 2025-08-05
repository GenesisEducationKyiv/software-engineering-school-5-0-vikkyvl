import { Injectable, NestMiddleware } from '@nestjs/common';
import { MetricsService } from '../../modules/observability/metrics.service';
import { Method } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { METRIC_LABELS } from '../../common';

const MS_TO_SEC = 1000;
const STATUS_CODE = 400;

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    if (req.originalUrl === '/metrics') {
      return next();
    }

    const start: number = Date.now();
    const method = req.method as Method;
    const endpoint = req.originalUrl
      .split('?')[0]
      .split('/')
      .slice(0, 3)
      .join('/');

    res.on('finish', () => {
      const duration = (Date.now() - start) / MS_TO_SEC;

      const statusCode = res.statusCode;
      const status = statusCode.toString();

      if (endpoint.startsWith(METRIC_LABELS.ENDPOINT.WEATHER)) {
        this.metricsService.incrementWeatherRequestCounter(
          method,
          endpoint,
          status,
        );

        if (statusCode >= STATUS_CODE) {
          this.metricsService.incrementWeatherErrorCounter(
            method,
            endpoint,
            status,
          );
        }

        this.metricsService.observeWeatherDuration(
          method,
          endpoint,
          status,
          duration,
        );
      } else if (
        endpoint.startsWith(METRIC_LABELS.ENDPOINT.SUBSCRIPTION) ||
        endpoint.startsWith(METRIC_LABELS.ENDPOINT.CONFIRM) ||
        endpoint.startsWith(METRIC_LABELS.ENDPOINT.UNSUBSCRIBE)
      ) {
        this.metricsService.incrementSubscriptionRequestCounter(
          method,
          endpoint,
          status,
        );

        if (statusCode >= STATUS_CODE) {
          this.metricsService.incrementSubscriptionErrorCounter(
            method,
            endpoint,
            status,
          );
        }

        this.metricsService.observeSubscriptionDuration(
          method,
          endpoint,
          status,
          duration,
        );
      }
    });

    next();
  }
}
