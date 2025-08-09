import { Injectable, NestMiddleware } from '@nestjs/common';
import { MetricsService } from '../../modules/observability/metrics.service';
import { Method } from 'axios';
import { NextFunction, Request, Response } from 'express';

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
    const endpoint = req.url;

    res.on('finish', () => {
      const duration = (Date.now() - start) / MS_TO_SEC;

      const statusCode = res.statusCode;
      const status = statusCode.toString();

      this.metricsService.incrementHttpRequestCounter(method, endpoint, status);

      if (statusCode >= STATUS_CODE) {
        this.metricsService.incrementHttpErrorCounter(method, endpoint, status);
      }

      this.metricsService.observeHttpDuration(
        method,
        endpoint,
        status,
        duration,
      );
    });

    next();
  }
}
