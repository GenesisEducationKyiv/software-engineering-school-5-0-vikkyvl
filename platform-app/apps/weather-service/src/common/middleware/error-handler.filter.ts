import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  CityNotFound,
  DomainException,
  IntervalError,
  InvalidRequest,
  WeatherProvidersFailed,
} from '../exceptions';
import { Observable, throwError } from 'rxjs';
import { weatherErrors } from '../constants';

@Catch()
export class ErrorHandlerFilter implements ExceptionFilter<RpcException> {
  catch(exception: unknown): Observable<never> {
    let message: string;

    if (exception instanceof DomainException) {
      message = exception.getMessage();

      if (exception instanceof CityNotFound) {
        return throwError(() => ({
          code: weatherErrors.CITY_NOT_FOUND.status,
          message: message,
        }));
      }

      if (exception instanceof InvalidRequest) {
        return throwError(() => ({
          code: weatherErrors.INVALID_REQUEST.status,
          message: message,
        }));
      }

      if (exception instanceof WeatherProvidersFailed) {
        return throwError(() => ({
          code: weatherErrors.PROVIDERS_NOT_AVAILABLE.status,
          message: message,
        }));
      }
    }

    const errorResponse = new IntervalError();
    message = errorResponse.getMessage();

    return throwError(() => ({
      code: weatherErrors.INTERNAL_ERROR.status,
      message: message,
    }));
  }
}
