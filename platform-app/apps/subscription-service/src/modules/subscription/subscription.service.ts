import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionDto } from '../../../../../common/shared/dtos/subscription/subscription.dto';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { subscriptionErrors } from '../errors';
import { MessageResponseDto } from '../../../../../common/shared/dtos/subscription/message-response.dto';
import { EmailSenderServiceInterface } from '../external/mail/email/email-sender.service';
import { SubscriptionRepositoryInterface } from '../repository/subscription.repository.interface';
import { LinkServiceInterface } from '../link/link.service';
import { MailConnectionResultDto } from '../external/mail/email/dto/mail-connection-result.dto';

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
    @Inject('LinkServiceInterface')
    private readonly linkService: LinkServiceInterface,
  ) {}

  async formSubscription(dto: SubscriptionDto): Promise<MessageResponseDto> {
    const isEmail = await this.subscriptionRepository.findByEmail(dto.email);

    if (isEmail) {
      throw new RpcException(subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED);
    }

    const token = uuidv4();

    const { confirmLink, unsubscribeLink } = this.linkService.getLinks(token);

    const resultConnection: MailConnectionResultDto =
      await this.emailSenderService.sendSubscriptionEmail(
        dto.email,
        confirmLink,
        unsubscribeLink,
      );

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
      message: 'Confirmation email sent.',
    };
  }
}
