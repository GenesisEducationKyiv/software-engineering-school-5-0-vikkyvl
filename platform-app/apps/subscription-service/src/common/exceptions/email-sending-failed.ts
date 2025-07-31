import { DomainException } from './domain-exception';
import { subscriptionErrors } from '../constantas';

export class EmailSendingFailed extends DomainException {
  constructor() {
    super(subscriptionErrors.EMAIL_SENDING_FAILED.message);
  }

  getMessage(): string {
    return this.message;
  }
}
