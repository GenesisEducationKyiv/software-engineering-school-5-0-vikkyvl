import { DomainException } from './domain-exception';
import { weatherErrors } from '../constants';

export class CityNotFound extends DomainException {
  constructor() {
    super(weatherErrors.CITY_NOT_FOUND.message);
  }

  getStatus(): number {
    return weatherErrors.CITY_NOT_FOUND.status;
  }

  getMessage(): string {
    return this.message;
  }
}
