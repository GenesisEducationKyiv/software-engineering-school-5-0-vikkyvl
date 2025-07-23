import { DomainException } from './domain-exception';
import { weatherErrors } from '../constants';

export class WeatherProvidersFailed extends DomainException {
  constructor() {
    super(weatherErrors.PROVIDERS_NOT_AVAILABLE.message);
  }

  getMessage(): string {
    return this.message;
  }
}
