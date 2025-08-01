import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { EmailSenderService } from './infrastructure/external/mail/email/email-sender.service';
import { subscriptionTokens } from '../../common';
import { LinkService } from './infrastructure/external/link/link.service';
import { Transporter } from './infrastructure/external/mail/email/utils/transporter';

@Module({
  providers: [
    NotificationService,
    EmailSenderService,
    {
      provide: subscriptionTokens.LINK_SERVICE_INTERFACE,
      useClass: LinkService,
    },
    {
      provide: subscriptionTokens.TRANSPORTER_INTERFACE,
      useClass: Transporter,
    },
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
