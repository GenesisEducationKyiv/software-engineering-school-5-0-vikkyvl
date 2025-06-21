import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError, throwError, firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

export abstract class MicroserviceClient {
  private readonly logger = new Logger(this.constructor.name);

  protected constructor(protected readonly client: ClientProxy) {}

  protected send<T = any, R = any>(pattern: T, data: any): Promise<R> {
    const res$ = this.client.send(pattern, data).pipe(
      timeout(5000),
      catchError((e: Error) => {
        this.logger.error(e.message);

        return throwError(() => e);
      }),
    );

    return firstValueFrom(res$);
  }
}
