import { subscriptionErrors } from '../constantas';
import { DomainException } from './domain-exception';

export class UnexpectedError extends DomainException {
  constructor() {
    super(subscriptionErrors.UNEXPECTED_ERROR.message);
  }

  getStatus(): number {
    return subscriptionErrors.UNEXPECTED_ERROR.status;
  }

  getMessage(): string {
    return this.message;
  }
}
