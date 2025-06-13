import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubscriptionDto } from './dto/subscription.dto';
import { patterns } from '../patterns';
import { MicroserviceClient } from '../../common/microservice-client';
import { MessageResponseDto } from './dto/message-response.dto';

@Injectable()
export class SubscriptionService extends MicroserviceClient {
  constructor(
    @Inject('SUBSCRIPTION_SERVICE')
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async createSubscription(dto: SubscriptionDto): Promise<MessageResponseDto> {
    return this.send(patterns.SUBSCRIPTION.CREATE_SUBSCRIPTION, dto);
  }
}
