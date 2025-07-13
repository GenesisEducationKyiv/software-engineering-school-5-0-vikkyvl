import { DomainException } from './domain-exception';
import { weatherErrors } from '../constants';

export class WeatherProvidersFailed extends DomainException {
  constructor() {
    super(weatherErrors.PROVIDERS_NOT_AVAILABLE.message);
  }

  getCode(): number {
    return weatherErrors.PROVIDERS_NOT_AVAILABLE.code;
  }

  getStatus(): number {
    return weatherErrors.PROVIDERS_NOT_AVAILABLE.status;
  }

  getMessage(): string {
    return this.message;
  }
}
