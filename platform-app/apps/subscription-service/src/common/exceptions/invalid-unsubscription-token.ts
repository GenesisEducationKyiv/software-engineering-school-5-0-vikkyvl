import { DomainException } from './domain-exception';
import { subscriptionErrors } from '../constantas';

export class InvalidUnsubscriptionToken extends DomainException {
  constructor() {
    super(subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN.message);
  }

  getMessage(): string {
    return this.message;
  }
}
