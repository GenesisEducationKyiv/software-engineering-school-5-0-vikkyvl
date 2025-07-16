import { weatherErrors } from '../constants';
import { DomainException } from './domain-exception';

export class InvalidRequest extends DomainException {
  constructor() {
    super(weatherErrors.INVALID_REQUEST.message);
  }

  getStatus(): number {
    return weatherErrors.INVALID_REQUEST.status;
  }

  getMessage(): string {
    return this.message;
  }
}
