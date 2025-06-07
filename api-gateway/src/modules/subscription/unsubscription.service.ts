import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { patterns } from '../patterns';
import { MicroserviceClient } from '../../common/microservice-client';

@Injectable()
export class UnsubscriptionService extends MicroserviceClient {
  constructor(
    @Inject('SUBSCRIPTION_SERVICE')
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async unsubscribe(token: string): Promise<UnsubscriptionService> {
    return this.send(patterns.UNSUBSCRIPTION.GET_TOKEN, token);
  }
}
