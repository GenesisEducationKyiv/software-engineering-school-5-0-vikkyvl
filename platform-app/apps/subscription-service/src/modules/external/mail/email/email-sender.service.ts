import { subscriptionHtml } from './templates/subscription-confirmation';
import { Inject, Injectable } from '@nestjs/common';
import { MailConnectionResultDto } from './dto/mail-connection-result.dto';
import { LinkServiceInterface } from '../../link/link.service';
import { subscriptionTokens } from '../../../../common';

export interface TransporterInterface {
  sendMail(email: string, html: string): Promise<boolean>;
}

@Injectable()
export class EmailSenderService {
  constructor(
    @Inject(subscriptionTokens.LINK_SERVICE_INTERFACE)
    private readonly linkService: LinkServiceInterface,
    @Inject(subscriptionTokens.TRANSPORTER_INTERFACE)
    private readonly transporter: TransporterInterface,
  ) {}

  async sendSubscriptionEmail(
    email: string,
    token: string,
  ): Promise<MailConnectionResultDto> {
    const { confirmLink, unsubscribeLink } = this.linkService.getLinks(token);

    const html = subscriptionHtml
      .replace('{{confirmLink}}', confirmLink)
      .replace('{{unsubscribeLink}}', unsubscribeLink);

    const response = await this.transporter.sendMail(email, html);

    return { isDelivered: response };
  }
}
