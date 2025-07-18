import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { DomainException, IntervalError } from '../exceptions';
import { Observable, throwError } from 'rxjs';

@Catch()
export class ErrorHandlerFilter implements ExceptionFilter<RpcException> {
  catch(exception: unknown): Observable<never> {
    if (exception instanceof DomainException) {
      const status = exception.getStatus();
      const message = exception.getMessage();

      return throwError(() => ({ code: status, message: message }));
    }

    return throwError(() => new IntervalError());
  }
}
