import { transporter } from '../../utils/transporter';
import { subscriptionHtml } from './templates/subscription-confirmation';
import { configService } from '../../config/config.service';

export class EmailSenderService {
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
