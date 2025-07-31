import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubscriptionRequestDto } from '../../../../../common/shared';
import { patterns } from '../../../../../common/shared';
import { MicroserviceClient } from '../../shared';
import { MessageResponseDto } from '../../../../../common/shared';

@Injectable()
export class SubscriptionService extends MicroserviceClient {
  constructor(
    @Inject('SUBSCRIPTION_SERVICE')
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async createSubscription(
    dto: SubscriptionRequestDto,
  ): Promise<MessageResponseDto> {
    return this.send(patterns.SUBSCRIPTION.CREATE_SUBSCRIPTION, dto);
  }

  async confirmSubscription(token: string): Promise<MessageResponseDto> {
    return this.send(patterns.CONFIRMATION.GET_TOKEN, token);
  }

  async unsubscribeSubscription(token: string): Promise<MessageResponseDto> {
    return this.send(patterns.UNSUBSCRIPTION.GET_TOKEN, token);
  }
}
