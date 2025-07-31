import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import {
  CityNotFound,
  DomainException,
  IntervalError,
  InvalidRequest,
  WeatherProvidersFailed,
} from '../exceptions';
import { weatherErrors } from '../constants';
import { mapGrpcToHttp } from '../../../../../common/shared';

@Catch()
export class HttpErrorHandlerFilter implements ExceptionFilter<HttpException> {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response: Response = host.switchToHttp().getResponse();

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

    response.status(mapGrpcToHttp(status)).json({
      status: mapGrpcToHttp(status),
      message: message,
    });
  }
}
