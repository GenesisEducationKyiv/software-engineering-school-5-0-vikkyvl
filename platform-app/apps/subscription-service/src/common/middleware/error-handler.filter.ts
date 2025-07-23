import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  DomainException,
  EmailAlreadySubscribed,
  EmailSendingFailed,
  InvalidConfirmationToken,
  InvalidUnsubscriptionToken,
  UnexpectedError,
} from '../exceptions';
import { Observable, throwError } from 'rxjs';
import { subscriptionErrors } from '../constantas';

@Catch()
export class ErrorHandlerFilter implements ExceptionFilter<RpcException> {
  catch(exception: unknown): Observable<never> {
    let message: string;

    if (exception instanceof DomainException) {
      message = exception.getMessage();

      if (exception instanceof EmailAlreadySubscribed) {
        return throwError(() => ({
          status: subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED.status,
          message: message,
        }));
      }

      if (exception instanceof EmailSendingFailed) {
        return throwError(() => ({
          status: subscriptionErrors.EMAIL_SENDING_FAILED.status,
          message: message,
        }));
      }

      if (exception instanceof InvalidConfirmationToken) {
        return throwError(() => ({
          status: subscriptionErrors.INVALID_CONFIRMATION_TOKEN.status,
          message: message,
        }));
      }

      if (exception instanceof InvalidUnsubscriptionToken) {
        return throwError(() => ({
          status: subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN.status,
          message: message,
        }));
      }
    }

    const errorResponse = new UnexpectedError();
    message = errorResponse.getMessage();

    return throwError(() => ({
      status: subscriptionErrors.UNEXPECTED_ERROR.status,
      message: message,
    }));
  }
}
