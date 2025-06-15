import { transporter } from './utils/transporter';
import { subscriptionHtml } from './templates/subscription-confirmation';
import { configService } from '../../../../../../../common/config/subscription-config.service';
import { Injectable } from '@nestjs/common';
import { MailConnectionResultDto } from './dto/mail-connection-result.dto';

export interface EmailSenderServiceInterface {
  sendSubscriptionEmail(
    email: string,
    confirmLink: string,
    unsubscribeLink: string,
  ): Promise<MailConnectionResultDto>;
}

@Injectable()
export class EmailSenderService implements EmailSenderServiceInterface {
  async sendSubscriptionEmail(
    email: string,
    confirmLink: string,
    unsubscribeLink: string,
  ): Promise<MailConnectionResultDto> {
    const resultConnection = await transporter.verify();

    if (!resultConnection) {
      return { isDelivered: false };
    }

    const html = subscriptionHtml
      .replace('{{confirmLink}}', confirmLink)
      .replace('{{unsubscribeLink}}', unsubscribeLink);

    await transporter.sendMail({
      from: `Weather API Application <${configService.getEmailUser()}>`,
      to: email,
      subject: 'Confirm your weather subscription',
      html,
    });

    return { isDelivered: true };
  }
}
