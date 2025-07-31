import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { errorMessages } from '../../common';
import { GrpcCode, mapGrpcToHttp } from '../../../../../common/shared';
import { GrpcException } from '../../common/exceptions/grpc-exception';
import { MessageBrokerException } from '../../common/exceptions/message-broker-exception';

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

    switch (true) {
      case exception instanceof HttpException:
        this.handleHttpException(response, exception);

        return;

      case exception instanceof GrpcException:
        this.handleGrpcException(response, exception);

        return;

      case exception instanceof MessageBrokerException:
        this.handleMessageBrokerException(response, exception);

        return;

      default:
        this.sendResponse(response, this.defaultStatus, this.defaultMessage);
    }
  }

  private handleHttpException(response: Response, error: HttpException): void {
    const status = error.getStatus();
    const message = (error.getResponse() as HttpException).message;

    this.sendResponse(response, status, message);
  }

  private handleGrpcException(response: Response, error: GrpcException): void {
    const status: number =
      mapGrpcToHttp(error.code as GrpcCode) ?? this.defaultStatus;
    let message: string = error.details ?? error.message ?? this.defaultMessage;

    if (error.code === GrpcCode.UNAVAILABLE) {
      message = this.defaultMessage;
    }

    this.sendResponse(response, status, message);
  }

  private handleMessageBrokerException(
    response: Response,
    error: MessageBrokerException,
  ): void {
    const status: number = error.status ?? this.defaultStatus;
    let message: string = error.message ?? this.defaultMessage;

    if (error.message === errorMessages.TIMEOUT.message) {
      message = this.defaultMessage;
    }

    this.sendResponse(response, status, message);
  }

  private sendResponse(
    response: Response,
    status: number,
    message: string,
  ): void {
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
