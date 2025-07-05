import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors } from '../../common';
import { MessageResponseDto } from '../../../../../common/shared';
import { SubscriptionRepositoryInterface } from './infrastructure/repository/interfaces/subscription.repository.interface';
import { messages } from '../../common';

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
      return { message: messages.CONFIRMATION.ALREADY_CONFIRMED };
    }

    subscription.confirmed = true;
    await this.subscriptionRepository.saveSubscription(subscription);

    return { message: messages.CONFIRMATION.SUCCESS };
  }
}
