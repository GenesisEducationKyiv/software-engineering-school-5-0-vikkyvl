import { Counter, Histogram, register } from 'prom-client';
import { Injectable } from '@nestjs/common';
import {
  COMMON_LABELS,
  COMMON_BUCKETS,
  METRIC_DESCRIPTION,
} from '../../common';

@Injectable()
export class MetricsService {
  private readonly httpRequestCounter: Counter;
  private readonly httpErrorCounter: Counter;
  private readonly httpDurationHistogram: Histogram;

  constructor() {
    register.clear();

    this.httpRequestCounter = new Counter({
      name: METRIC_DESCRIPTION.NAME.HTTP_REQUEST_TOTAL,
      help: METRIC_DESCRIPTION.HELP.HTTP_REQUEST_TOTAL,
      labelNames: COMMON_LABELS,
    });

    this.httpErrorCounter = new Counter({
      name: METRIC_DESCRIPTION.NAME.HTTP_ERROR_TOTAL,
      help: METRIC_DESCRIPTION.HELP.HTTP_ERROR_TOTAL,
      labelNames: COMMON_LABELS,
    });

    this.httpDurationHistogram = new Histogram({
      name: METRIC_DESCRIPTION.NAME.HTTP_DURATION_SECONDS,
      help: METRIC_DESCRIPTION.HELP.HTTP_DURATION_SECONDS,
      labelNames: COMMON_LABELS,
      buckets: COMMON_BUCKETS,
    });
  }

  incrementHttpRequestCounter(
    method: string,
    endpoint: string,
    status: string,
  ): void {
    this.httpRequestCounter.inc({ method, endpoint, status });
  }

  incrementHttpErrorCounter(
    method: string,
    endpoint: string,
    status: string,
  ): void {
    this.httpErrorCounter.inc({ method, endpoint, status });
  }

  observeHttpDuration(
    method: string,
    endpoint: string,
    status: string,
    duration: number,
  ): void {
    this.httpDurationHistogram.observe({ method, endpoint, status }, duration);
  }
}
