import { transporter } from './utils/transporter';
import { subscriptionHtml } from './templates/subscription-confirmation';
import { configService } from '../../../../../../common/config/subscription-config.service';
import { Injectable } from '@nestjs/common';

export interface EmailSenderServiceInterface {
  sendSubscriptionEmail(
    email: string,
    confirmLink: string,
    unsubscribeLink: string,
  ): Promise<void>;
}

@Injectable()
export class EmailSenderService implements EmailSenderServiceInterface {
  async sendSubscriptionEmail(
    email: string,
    confirmLink: string,
    unsubscribeLink: string,
  ): Promise<void> {
    const html = subscriptionHtml
      .replace('{{confirmLink}}', confirmLink)
      .replace('{{unsubscribeLink}}', unsubscribeLink);

    await transporter.sendMail({
      from: `Weather API Application <${configService.getEmailUser()}>`,
      to: email,
      subject: 'Confirm your weather subscription',
      html,
    });
  }
}
