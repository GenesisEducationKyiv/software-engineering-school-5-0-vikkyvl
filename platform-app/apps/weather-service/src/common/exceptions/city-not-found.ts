import { DomainException } from './domain-exception';
import { weatherErrors } from '../constants';

export class CityNotFound extends DomainException {
  constructor() {
    super(weatherErrors.CITY_NOT_FOUND.message);
  }

  getMessage(): string {
    return this.message;
  }
}
