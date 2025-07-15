import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors, subscriptionTokens } from '../../common';
import { MessageResponseDto } from '../../../../../common/shared';
import { SubscriptionRepositoryInterface } from '../repository/subscription.repository.interface';
import { messages } from '../../common';

interface ConfirmationServiceInterface {
  confirmSubscription(token: string): Promise<MessageResponseDto>;
}

@Injectable()
export class ConfirmationService implements ConfirmationServiceInterface {
  constructor(
    @Inject(subscriptionTokens.SUBSCRIPTION_REPOSITORY_INTERFACE)
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
  ) {}

  async confirmSubscription(token: string): Promise<MessageResponseDto> {
    const subscription = await this.subscriptionRepository.findByToken(token);

    if (!subscription) {
      throw new RpcException(subscriptionErrors.INVALID_CONFIRMATION_TOKEN);
    }

    if (subscription.confirmed) {
      return { message: messages.CONFIRMATION.ALREADY_CONFIRMED };
    }

    subscription.confirmed = true;
    await this.subscriptionRepository.saveSubscription(subscription);

    return { message: messages.CONFIRMATION.SUCCESS };
  }
}
