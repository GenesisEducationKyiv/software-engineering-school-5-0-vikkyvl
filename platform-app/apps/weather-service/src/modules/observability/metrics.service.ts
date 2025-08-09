import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';
import { METRIC_DESCRIPTION } from '../../common';

@Injectable()
export class MetricsService {
  private readonly cacheHitCounter: Counter;
  private readonly cacheMissCounter: Counter;

  constructor() {
    register.clear();

    this.cacheHitCounter = new Counter({
      name: METRIC_DESCRIPTION.NAME.CACHE_HIT_TOTAL,
      help: METRIC_DESCRIPTION.HELP.CACHE_HIT_TOTAL,
    });

    this.cacheMissCounter = new Counter({
      name: METRIC_DESCRIPTION.NAME.CACHE_MISS_TOTAL,
      help: METRIC_DESCRIPTION.HELP.CACHE_MISS_TOTAL,
    });
  }

  incrementCacheHitCounter() {
    this.cacheHitCounter.inc();
  }

  incrementCacheMissCounter() {
    this.cacheMissCounter.inc();
  }
}
