import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { domainExceptionHelper } from './domain-exception.helper';
import { contexType } from '../constants/contex-type';

@Catch()
export class GrpcErrorHandlerFilter implements ExceptionFilter<RpcException> {
  catch(exception: unknown): Observable<never> | void {
    const { status, message } = domainExceptionHelper(
      exception,
      contexType.GRPC,
    );

    return throwError(() => ({
      code: status,
      message: message,
    }));
  }
}
