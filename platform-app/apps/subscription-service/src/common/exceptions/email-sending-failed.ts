import { DomainException } from './domain-exception';
import { subscriptionErrors } from '../constantas';

export class EmailSendingFailed extends DomainException {
  constructor() {
    super(subscriptionErrors.EMAIL_SENDING_FAILED.message);
  }

  getStatus(): number {
    return subscriptionErrors.EMAIL_SENDING_FAILED.status;
  }

  getMessage(): string {
    return this.message;
  }
}
