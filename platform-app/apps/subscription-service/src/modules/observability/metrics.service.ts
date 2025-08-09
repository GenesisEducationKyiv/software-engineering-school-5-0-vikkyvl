import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';
import { SUBSCRIPTION_LABELS, METRIC_DESCRIPTION } from '../../common';
import { Status } from '../../common';

@Injectable()
export class MetricsService {
  private readonly subscriptionSendingEmailCounter: Counter;

  constructor() {
    register.clear();

    this.subscriptionSendingEmailCounter = new Counter({
      name: METRIC_DESCRIPTION.NAME.SUBSCRIPTION_SENDING_EMAIL_TOTAL,
      help: METRIC_DESCRIPTION.HELP.SUBSCRIPTION_SENDING_EMAIL_TOTAL,
      labelNames: SUBSCRIPTION_LABELS,
    });
  }

  incrementSubscriptionSendingEmailCounter(status: Status) {
    this.subscriptionSendingEmailCounter.inc({ status });
  }
}
