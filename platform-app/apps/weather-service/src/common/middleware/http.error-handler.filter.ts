import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { domainExceptionHelper } from './domain-exception.helper';
import { contexType } from '../constants/contex-type';

@Catch()
export class HttpErrorHandlerFilter implements ExceptionFilter<HttpException> {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response: Response = host.switchToHttp().getResponse();

    const { status, message } = domainExceptionHelper(
      exception,
      contexType.HTTP,
    );

    response.status(status).json({
      status: status,
      message: message,
    });
  }
}
