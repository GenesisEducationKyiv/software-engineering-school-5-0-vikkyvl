import { weatherErrors } from '../constants';
import {
  CityNotFound,
  DomainException,
  IntervalError,
  InvalidRequest,
  WeatherProvidersFailed,
} from '../exceptions';
import { contexType } from '../constants/contex-type';

export function domainExceptionHelper(
  exception: unknown,
  type: string,
): {
  status: number;
  message: string;
} {
  const errorResponse = new IntervalError();

  let error = weatherErrors.INTERNAL_ERROR;
  let message: string = errorResponse.getMessage();

  if (exception instanceof DomainException) {
    message = exception.getMessage();

    if (exception instanceof CityNotFound) {
      error = weatherErrors.CITY_NOT_FOUND;
    } else if (exception instanceof InvalidRequest) {
      error = weatherErrors.INVALID_REQUEST;
    } else if (exception instanceof WeatherProvidersFailed) {
      error = weatherErrors.PROVIDERS_NOT_AVAILABLE;
    }
  }

  const status =
    type === contexType.HTTP
      ? (error.status ?? weatherErrors.INTERNAL_ERROR.status)
      : (error.code ?? weatherErrors.INTERNAL_ERROR.code);

  return { status, message };
}
