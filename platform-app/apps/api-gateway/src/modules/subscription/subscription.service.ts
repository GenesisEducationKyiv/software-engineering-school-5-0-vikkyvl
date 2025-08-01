import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubscriptionRequestDto } from '../../../../../common/shared';
import { patternsRMQ } from '../../../../../common/shared';
import { MicroserviceClientMessageBroker } from '../../shared';
import { MessageResponseDto } from '../../../../../common/shared';
import { serviceTokens } from '../../common';
import { TokenRequestDto } from '../../../../../common/shared/dtos/subscription/token-request.dto';

@Injectable()
export class SubscriptionService extends MicroserviceClientMessageBroker {
  constructor(
    @Inject(serviceTokens.SUBSCRIPTION_SERVICE)
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async createSubscription(
    dto: SubscriptionRequestDto,
  ): Promise<MessageResponseDto> {
    return this.send(patternsRMQ.SUBSCRIPTION.CREATE_SUBSCRIPTION, dto);
  }

  async confirmSubscription(dto: TokenRequestDto): Promise<MessageResponseDto> {
    return this.send(patternsRMQ.CONFIRMATION.GET_TOKEN, dto);
  }

  async unsubscribeSubscription(
    dto: TokenRequestDto,
  ): Promise<MessageResponseDto> {
    return this.send(patternsRMQ.UNSUBSCRIPTION.GET_TOKEN, dto);
  }
}
