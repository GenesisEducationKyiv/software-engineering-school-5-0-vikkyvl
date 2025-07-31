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
export class GrpcErrorHandlerFilter implements ExceptionFilter<RpcException> {
  catch(exception: unknown): Observable<never> | void {
    const errorResponse = new IntervalError();

    let status: number = weatherErrors.INTERNAL_ERROR.code;
    let message: string = errorResponse.getMessage();

    if (exception instanceof DomainException) {
      message = exception.getMessage();

      if (exception instanceof CityNotFound) {
        status = weatherErrors.CITY_NOT_FOUND.code;
      } else if (exception instanceof InvalidRequest) {
        status = weatherErrors.INVALID_REQUEST.code;
      } else if (exception instanceof WeatherProvidersFailed) {
        status = weatherErrors.PROVIDERS_NOT_AVAILABLE.code;
      }
    }

    return throwError(() => ({
      code: status,
      message: message,
    }));
  }
}
