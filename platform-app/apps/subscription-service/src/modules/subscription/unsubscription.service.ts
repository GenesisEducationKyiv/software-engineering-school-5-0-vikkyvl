import { Inject, Injectable } from '@nestjs/common';
import { InvalidUnsubscriptionToken, subscriptionTokens } from '../../common';
import { MessageResponseDto } from '../../../../../common/shared';
import { SubscriptionRepositoryInterface } from './infrastructure/repository/interfaces/subscription.repository.interface';
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
      throw new InvalidUnsubscriptionToken();
    }

    await this.subscriptionRepository.deleteSubscription(subscription);

    return { message: messages.UNSUBSCRIPTION.SUCCESS };
  }
}
