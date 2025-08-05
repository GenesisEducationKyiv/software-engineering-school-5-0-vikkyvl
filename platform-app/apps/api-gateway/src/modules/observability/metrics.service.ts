import { Counter, Histogram, register } from 'prom-client';
import { Injectable } from '@nestjs/common';
import {
  COMMON_LABELS,
  COMMON_BUCKETS,
  METRIC_DESCRIPTION,
} from '../../common';

@Injectable()
export class MetricsService {
  private readonly weatherRequestCounter: Counter;
  private readonly weatherErrorCounter: Counter;
  private readonly weatherDurationHistogram: Histogram;

  private readonly subscriptionRequestCounter: Counter;
  private readonly subscriptionErrorCounter: Counter;
  private readonly subscriptionDurationHistogram: Histogram;

  constructor() {
    register.clear();

    this.weatherRequestCounter = new Counter({
      name: METRIC_DESCRIPTION.NAME.WEATHER_REQUEST_TOTAL,
      help: METRIC_DESCRIPTION.HELP.WEATHER_REQUEST_TOTAL,
      labelNames: COMMON_LABELS,
    });

    this.weatherErrorCounter = new Counter({
      name: METRIC_DESCRIPTION.NAME.WEATHER_ERROR_TOTAL,
      help: METRIC_DESCRIPTION.HELP.WEATHER_ERROR_TOTAL,
      labelNames: COMMON_LABELS,
    });

    this.weatherDurationHistogram = new Histogram({
      name: METRIC_DESCRIPTION.NAME.WEATHER_DURATION_SECONDS,
      help: METRIC_DESCRIPTION.HELP.WEATHER_DURATION_SECONDS,
      labelNames: COMMON_LABELS,
      buckets: COMMON_BUCKETS,
    });

    this.subscriptionRequestCounter = new Counter({
      name: METRIC_DESCRIPTION.NAME.SUBSCRIPTION_REQUEST_TOTAL,
      help: METRIC_DESCRIPTION.HELP.SUBSCRIPTION_REQUEST_TOTAL,
      labelNames: COMMON_LABELS,
    });

    this.subscriptionErrorCounter = new Counter({
      name: METRIC_DESCRIPTION.NAME.SUBSCRIPTION_ERROR_TOTAL,
      help: METRIC_DESCRIPTION.HELP.SUBSCRIPTION_ERROR_TOTAL,
      labelNames: COMMON_LABELS,
    });

    this.subscriptionDurationHistogram = new Histogram({
      name: METRIC_DESCRIPTION.NAME.SUBSCRIPTION_DURATION_SECONDS,
      help: METRIC_DESCRIPTION.HELP.SUBSCRIPTION_DURATION_SECONDS,
      labelNames: COMMON_LABELS,
      buckets: COMMON_BUCKETS,
    });
  }

  incrementWeatherRequestCounter(
    method: string,
    endpoint: string,
    status: string,
  ): void {
    this.weatherRequestCounter.inc({ method, endpoint, status });
  }

  incrementSubscriptionRequestCounter(
    method: string,
    endpoint: string,
    status: string,
  ): void {
    this.subscriptionRequestCounter.inc({ method, endpoint, status });
  }

  incrementWeatherErrorCounter(
    method: string,
    endpoint: string,
    status: string,
  ): void {
    this.weatherErrorCounter.inc({ method, endpoint, status });
  }

  incrementSubscriptionErrorCounter(
    method: string,
    endpoint: string,
    status: string,
  ): void {
    this.subscriptionErrorCounter.inc({ method, endpoint, status });
  }

  observeWeatherDuration(
    method: string,
    endpoint: string,
    status: string,
    duration: number,
  ): void {
    this.weatherDurationHistogram.observe(
      { method, endpoint, status },
      duration,
    );
  }

  observeSubscriptionDuration(
    method: string,
    endpoint: string,
    status: string,
    duration: number,
  ): void {
    this.subscriptionDurationHistogram.observe(
      { method, endpoint, status },
      duration,
    );
  }
}
