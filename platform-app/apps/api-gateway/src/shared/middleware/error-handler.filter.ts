import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { errorMessages, Errors } from '../../common';

@Catch()
export class ErrorHandlerFilter implements ExceptionFilter {
  private readonly defaultStatus = errorMessages.INTERNAL_SERVER_ERROR.status;

  constructor(
    private readonly defaultMessage = errorMessages.INTERNAL_SERVER_ERROR
      .message,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      this.handleHttpException(response, exception);

      return;
    }

    if (exception instanceof Error) {
      response.status(this.defaultStatus).json({
        statusCode: this.defaultStatus,
        message: this.defaultMessage,
      });

      return;
    }

    this.handleException(response, exception);
  }

  private handleHttpException(response: Response, error: HttpException): void {
    const status = error.getStatus();
    const message = (error.getResponse() as HttpException).message;

    response.status(status).json({
      statusCode: status,
      message,
    });
  }

  private handleException(response: Response, error: unknown): void {
    const res = error as Errors;
    const status = res.status || this.defaultStatus;
    const message = res.message || this.defaultMessage;

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
