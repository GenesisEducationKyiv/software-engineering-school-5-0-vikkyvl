import { Injectable } from '@nestjs/common';
import { EmailSenderService } from './infrastructure/external/mail/email/email-sender.service';
import { MailConnectionResultDto } from './infrastructure/external/mail/email/dto/mail-connection-result.dto';
import { EmailSendingFailed } from '../../common';

@Injectable()
export class NotificationService {
  constructor(private readonly emailSenderService: EmailSenderService) {}

  async sendSubscriptionNotification(
    email: string,
    token: string,
  ): Promise<void> {
    const resultConnection: MailConnectionResultDto =
      await this.emailSenderService.sendSubscriptionEmail(email, token);

    if (!resultConnection.isDelivered) {
      throw new EmailSendingFailed();
    }
  }
}
