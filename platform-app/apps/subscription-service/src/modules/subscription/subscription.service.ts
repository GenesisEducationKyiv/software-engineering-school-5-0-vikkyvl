import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionDto } from '../../../../../common/shared';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { subscriptionErrors } from '../../common';
import { MessageResponseDto } from '../../../../../common/shared';
import { EmailSenderService } from '../external/mail/email/email-sender.service';
import { SubscriptionRepositoryInterface } from '../repository/subscription.repository.interface';
import { MailConnectionResultDto } from '../external/mail/email/dto/mail-connection-result.dto';
import { messages } from '../../common';

interface SubscriptionServiceInterface {
  formSubscription(dto: SubscriptionDto): Promise<MessageResponseDto>;
}

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
  constructor(
    @Inject('SubscriptionRepositoryInterface')
    private readonly subscriptionRepository: SubscriptionRepositoryInterface,
    private readonly emailSenderService: EmailSenderService,
  ) {}

  async formSubscription(dto: SubscriptionDto): Promise<MessageResponseDto> {
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
      confirmed: false,
      token,
    });

    await this.subscriptionRepository.saveSubscription(subscription);

    return {
      message: messages.SUBSCRIPTION.EMAIL_SENT,
    };
  }
}
