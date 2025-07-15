import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors, subscriptionTokens } from '../../common';
import { MessageResponseDto } from '../../../../../common/shared';
import { SubscriptionRepositoryInterface } from '../repository/subscription.repository.interface';
import { messages } from '../../common';

interface UnsubscriptionServiceInterface {
  unsubscribeSubscription(token: string): Promise<MessageResponseDto>;
}

@Injectable()
export class UnsubscriptionService implements UnsubscriptionServiceInterface {
  constructor(
    @Inject(subscriptionTokens.SUBSCRIPTION_REPOSITORY_INTERFACE)
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
