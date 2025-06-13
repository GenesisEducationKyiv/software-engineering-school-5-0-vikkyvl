import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { patterns } from '../patterns';
import { MicroserviceClient } from '../../common/microservice-client';
import { MessageResponseDto } from './dto/message-response.dto';

@Injectable()
export class UnsubscriptionService extends MicroserviceClient {
  constructor(
    @Inject('SUBSCRIPTION_SERVICE')
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async unsubscribe(token: string): Promise<MessageResponseDto> {
    return this.send(patterns.UNSUBSCRIPTION.GET_TOKEN, token);
  }
}
