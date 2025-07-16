import { weatherErrors } from '../constants';
import { DomainException } from './domain-exception';

export class IntervalError extends DomainException {
  constructor() {
    super(weatherErrors.INTERNAL_ERROR.message);
  }

  getStatus(): number {
    return weatherErrors.INTERNAL_ERROR.status;
  }

  getMessage(): string {
    return this.message;
  }
}
