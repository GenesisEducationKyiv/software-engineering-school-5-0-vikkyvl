import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionDto } from '../../../../../common/shared/dtos/subscription/subscription.dto';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { subscriptionErrors } from '../errors';
import { MessageResponseDto } from '../../../../../common/shared/dtos/subscription/message-response.dto';
import { configService } from '../../../../../common/config/subscription-config.service';
import { EmailSenderServiceInterface } from '../mail/email/email-sender.service';
import { SubscriptionRepositoryInterface } from '../repository/subscription.repository.interface';

interface SubscriptionServiceInterface {
  formSubscription(dto: SubscriptionDto): Promise<MessageResponseDto>;
}

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
  constructor(
    @Inject('SubscriptionRepositoryInterface')
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
    @Inject('EmailSenderServiceInterface')
    private readonly emailSenderService: EmailSenderServiceInterface,
  ) {}

  async formSubscription(dto: SubscriptionDto): Promise<MessageResponseDto> {
    const isEmail = await this.subscriptionRepository.findByEmail(dto.email);

    if (isEmail) {
      throw new RpcException(subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED);
    }

    const token = uuidv4();

    const baseUrl = configService.getReactAppApiUrl();

    const confirmLink = `${baseUrl}/confirm/${token}`;
    const unsubscribeLink = `${baseUrl}/unsubscribe/${token}`;

    await this.emailSenderService.sendSubscriptionEmail(
      dto.email,
      confirmLink,
      unsubscribeLink,
    );

    const subscription = this.subscriptionRepository.createSubscription({
      ...dto,
      confirmed: false,
      token,
    });

    await this.subscriptionRepository.saveSubscription(subscription);

    return {
      message: 'Confirmation email sent.',
    };
  }
}
