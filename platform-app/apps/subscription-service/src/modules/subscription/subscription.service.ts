import { Inject, Injectable } from '@nestjs/common';
import {
  patternsRMQ,
  SubscriptionRequestDto,
} from '../../../../../common/shared';
import { v4 as uuidv4 } from 'uuid';
import { EmailAlreadySubscribed, subscriptionTokens } from '../../common';
import { MessageResponseDto } from '../../../../../common/shared';
import { SubscriptionRepositoryInterface } from './infrastructure/repository/interfaces/subscription.repository.interface';
import { messages } from '../../common';
import { ClientProxy } from '@nestjs/microservices';

interface SubscriptionServiceInterface {
  formSubscription(dto: SubscriptionRequestDto): Promise<MessageResponseDto>;
}

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
  constructor(
    @Inject(subscriptionTokens.SUBSCRIPTION_REPOSITORY_INTERFACE)
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
    @Inject(subscriptionTokens.NOTIFICATION_EVENT_SERVICE)
    private readonly eventClient: ClientProxy,
  ) {}

  async formSubscription(
    dto: SubscriptionRequestDto,
  ): Promise<MessageResponseDto> {
    const isEmail = await this.subscriptionRepository.findByEmail(dto.email);

    if (isEmail) {
      throw new EmailAlreadySubscribed();
    }

    const token = uuidv4();

    this.eventClient.emit(patternsRMQ.SUBSCRIPTION.CREATED_SUBSCRIPTION, {
      email: dto.email,
      token: token,
    });

    const subscription = this.subscriptionRepository.createSubscription({
      ...dto,
      city: dto.city.toLowerCase(),
      email: dto.email.toLowerCase(),
      confirmed: false,
      token,
    });

    await this.subscriptionRepository.saveSubscription(subscription);

    return {
      message: messages.SUBSCRIPTION.EMAIL_SENT,
    };
  }
}
