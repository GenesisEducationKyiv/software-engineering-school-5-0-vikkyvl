import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { domainExceptionHelper } from './domain-exception.helper';
import { contexType } from '../constants/contex-type';

@Catch()
export class HttpErrorHandlerFilter implements ExceptionFilter<HttpException> {
  private readonly logger = new Logger(this.constructor.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response: Response = host.switchToHttp().getResponse();

    const { status, message } = domainExceptionHelper(
      exception,
      contexType.HTTP,
    );

    this.logger.error({
      type: contexType.HTTP,
      status: status,
      message: message,
    });

    response.status(status).json({
      status: status,
      message: message,
    });
  }
}
