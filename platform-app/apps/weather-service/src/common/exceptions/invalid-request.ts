import { weatherErrors } from '../constants';
import { DomainException } from './domain-exception';

export class InvalidRequest extends DomainException {
  constructor() {
    super(weatherErrors.INVALID_REQUEST.message);
  }

  getMessage(): string {
    return this.message;
  }
}
