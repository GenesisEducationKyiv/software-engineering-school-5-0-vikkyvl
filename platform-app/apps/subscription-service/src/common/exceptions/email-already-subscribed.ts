import { DomainException } from './domain-exception';
import { subscriptionErrors } from '../constantas';

export class EmailAlreadySubscribed extends DomainException {
  constructor() {
    super(subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED.message);
  }

  getMessage(): string {
    return this.message;
  }
}
