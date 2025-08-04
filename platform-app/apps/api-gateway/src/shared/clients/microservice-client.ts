import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import {
  timeout,
  catchError,
  throwError,
  firstValueFrom,
  Observable,
} from 'rxjs';
import { Logger, OnModuleInit } from '@nestjs/common';
import { GrpcException } from '../../common/exceptions/grpc-exception';
import { MessageBrokerException } from '../../common/exceptions/message-broker-exception';

const DEFAULT_TIMEOUT = 5000;

export abstract class MicroserviceClientMessageBroker {
  private readonly logger = new Logger(this.constructor.name);

  protected constructor(protected readonly client: ClientProxy) {}

  protected send<T = any, R = any>(pattern: T, data: any): Promise<R> {
    const res$ = this.client.send(pattern, data).pipe(
      timeout(DEFAULT_TIMEOUT),
      catchError((e: unknown) => {
        const error = e as MessageBrokerException;
        this.logger.error(error.message);

        return throwError(() => new MessageBrokerException(error));
      }),
    );

    return firstValueFrom(res$);
  }
}

export abstract class MicroserviceClientGrpc<T extends object>
  implements OnModuleInit
{
  protected readonly logger = new Logger(this.constructor.name);
  service: T;

  protected constructor(
    protected readonly client: ClientGrpc,
    private readonly serviceName: string,
  ) {}

  onModuleInit(): void {
    this.service = this.client.getService<T>(this.serviceName);
  }

  protected async send<K>(data$: Observable<K>): Promise<K> {
    return await firstValueFrom(
      data$.pipe(
        timeout(DEFAULT_TIMEOUT),
        catchError((e: unknown) => {
          const error = e as GrpcException;
          this.logger.error(error.details);

          return throwError(() => new GrpcException(error));
        }),
      ),
    );
  }
}
