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
    const errorResponse = new UnexpectedError();

    let status: number = subscriptionErrors.UNEXPECTED_ERROR.status;
    let message: string = errorResponse.getMessage();

    if (exception instanceof DomainException) {
      message = exception.getMessage();

      if (exception instanceof EmailAlreadySubscribed) {
        status = subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED.status;
      } else if (exception instanceof EmailSendingFailed) {
        status = subscriptionErrors.EMAIL_SENDING_FAILED.status;
      } else if (exception instanceof InvalidConfirmationToken) {
        status = subscriptionErrors.INVALID_CONFIRMATION_TOKEN.status;
      } else if (exception instanceof InvalidUnsubscriptionToken) {
        status = subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN.status;
      }
    }

    return throwError(() => ({
      status: status,
      message: message,
    }));
  }
}
