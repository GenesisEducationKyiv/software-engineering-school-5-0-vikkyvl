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
    const errorResponse = new IntervalError();

    let status: number = weatherErrors.INTERNAL_ERROR.status;
    let message: string = errorResponse.getMessage();

    if (exception instanceof DomainException) {
      message = exception.getMessage();

      if (exception instanceof CityNotFound) {
        status = weatherErrors.CITY_NOT_FOUND.status;
      } else if (exception instanceof InvalidRequest) {
        status = weatherErrors.INVALID_REQUEST.status;
      } else if (exception instanceof WeatherProvidersFailed) {
        status = weatherErrors.PROVIDERS_NOT_AVAILABLE.status;
      }
    }

    return throwError(() => ({
      status: status,
      message: message,
    }));
  }
}
