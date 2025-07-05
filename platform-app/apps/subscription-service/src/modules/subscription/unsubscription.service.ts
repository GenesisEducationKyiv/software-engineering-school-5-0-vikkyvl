import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors } from '../../common';
import { MessageResponseDto } from '../../../../../common/shared';
import { SubscriptionRepositoryInterface } from './infrastructure/repository/interfaces/subscription.repository.interface';
import { messages } from '../../common';

interface UnsubscriptionServiceInterface {
  unsubscribeSubscription(token: string): Promise<MessageResponseDto>;
}

@Injectable()
export class UnsubscriptionService implements UnsubscriptionServiceInterface {
  constructor(
    @Inject('SubscriptionRepositoryInterface')
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
  ) {}

  async unsubscribeSubscription(token: string): Promise<MessageResponseDto> {
    const subscription = await this.subscriptionRepository.findByToken(token);

    if (!subscription) {
      throw new RpcException(subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN);
    }

    await this.subscriptionRepository.deleteSubscription(subscription);

    return { message: messages.UNSUBSCRIPTION.SUCCESS };
  }
}
