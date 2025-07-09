import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionRequestDto } from '../../../../../common/shared';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { subscriptionErrors, subscriptionTokens } from '../../common';
import { MessageResponseDto } from '../../../../../common/shared';
import { EmailSenderService } from './infrastructure/external/mail/email/email-sender.service';
import { SubscriptionRepositoryInterface } from './infrastructure/repository/interfaces/subscription.repository.interface';
import { MailConnectionResultDto } from './infrastructure/external/mail/email/dto/mail-connection-result.dto';
import { messages } from '../../common';

interface SubscriptionServiceInterface {
  formSubscription(dto: SubscriptionRequestDto): Promise<MessageResponseDto>;
}

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
  constructor(
    @Inject(subscriptionTokens.SUBSCRIPTION_REPOSITORY_INTERFACE)
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
    private readonly emailSenderService: EmailSenderService,
  ) {}

  async formSubscription(
    dto: SubscriptionRequestDto,
  ): Promise<MessageResponseDto> {
    const isEmail = await this.subscriptionRepository.findByEmail(dto.email);

    if (isEmail) {
      throw new RpcException(subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED);
    }

    const token = uuidv4();

    const resultConnection: MailConnectionResultDto =
      await this.emailSenderService.sendSubscriptionEmail(dto.email, token);

    if (!resultConnection.isDelivered) {
      throw new RpcException(subscriptionErrors.EMAIL_SENDING_FAILED);
    }

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
