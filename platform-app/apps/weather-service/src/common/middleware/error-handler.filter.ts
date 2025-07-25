import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
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
import { contexType } from '../constants/contex-type';

@Catch()
export class ErrorHandlerFilter implements ExceptionFilter<RpcException> {
  catch(exception: unknown, host: ArgumentsHost): Observable<never> | void {
    const ctxType = host.getType();

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

    if (ctxType === contexType.RPC) {
      return throwError(() => ({
        code: status,
        message: message,
      }));
    }

    if (ctxType === contexType.HTTP) {
      const response: Response = host.switchToHttp().getResponse();
      response.status(status).json({
        status: status,
        message: message,
      });
    }
  }
}
