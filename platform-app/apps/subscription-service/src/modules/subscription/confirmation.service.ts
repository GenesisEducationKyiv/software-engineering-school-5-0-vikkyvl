import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors } from '../errors';
import { MessageResponseDto } from '../../../../../common/shared';
import { SubscriptionRepositoryInterface } from '../repository/subscription.repository.interface';

interface ConfirmationServiceInterface {
  confirmSubscription(token: string): Promise<MessageResponseDto>;
}

@Injectable()
export class ConfirmationService implements ConfirmationServiceInterface {
  constructor(
    @Inject('SubscriptionRepositoryInterface')
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
  ) {}

  async confirmSubscription(token: string): Promise<MessageResponseDto> {
    const subscription = await this.subscriptionRepository.findByToken(token);

    if (!subscription) {
      throw new RpcException(subscriptionErrors.INVALID_CONFIRMATION_TOKEN);
    }

    if (subscription.confirmed) {
      return { message: 'Subscription already confirmed' };
    }

    subscription.confirmed = true;
    await this.subscriptionRepository.saveSubscription(subscription);

    return { message: 'Subscription confirmed successfully' };
  }
}
