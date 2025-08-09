import { Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { domainExceptionHelper } from './domain-exception.helper';
import { contexType } from '../constants/contex-type';

@Catch()
export class GrpcErrorHandlerFilter implements ExceptionFilter<RpcException> {
  private readonly logger = new Logger(this.constructor.name);

  catch(exception: unknown): Observable<never> | void {
    const { status, message } = domainExceptionHelper(
      exception,
      contexType.GRPC,
    );

    this.logger.error({
      type: contexType.GRPC,
      status: status,
      message: message,
    });

    return throwError(() => ({
      code: status,
      message: message,
    }));
  }
}
