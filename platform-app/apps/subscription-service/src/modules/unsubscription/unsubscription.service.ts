import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors } from '../errors';
import { MessageResponseDto } from '../../../../../common/shared/dtos/subscription/message-response.dto';
import { SubscriptionRepositoryInterface } from '../repository/subscription.repository.interface';

interface UnsubscriptionServiceInterface {
  unsubscribe(token: string): Promise<MessageResponseDto>;
}

@Injectable()
export class UnsubscriptionService implements UnsubscriptionServiceInterface {
  constructor(
    @Inject('SubscriptionRepositoryInterface')
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
  ) {}

  async unsubscribe(token: string): Promise<MessageResponseDto> {
    const subscription = await this.subscriptionRepository.findByToken(token);

    if (!subscription) {
      throw new RpcException(subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN);
    }

    await this.subscriptionRepository.deleteSubscription(subscription);

    return { message: 'Unsubscribed successfully' };
  }
}
