import { DomainException } from './domain-exception';
import { subscriptionErrors } from '../constantas';

export class InvalidConfirmationToken extends DomainException {
  constructor() {
    super(subscriptionErrors.INVALID_CONFIRMATION_TOKEN.message);
  }

  getStatus(): number {
    return subscriptionErrors.INVALID_CONFIRMATION_TOKEN.status;
  }

  getMessage(): string {
    return this.message;
  }
}
