import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '../../entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailSenderService } from '../external/mail/email/email-sender.service';
import { SubscriptionRepository } from '../repository/subscription.repository';
import { LinkService } from '../external/link/link.service';
import { ConfirmationService } from './confirmation.service';
import { UnsubscriptionService } from './unsubscription.service';
import { Transporter } from '../external/mail/email/utils/transporter';
import { subscriptionTokens } from '../../common';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    ConfirmationService,
    UnsubscriptionService,
    EmailSenderService,
    {
      provide: subscriptionTokens.TRANSPORTER_INTERFACE,
      useClass: Transporter,
    },
    {
      provide: subscriptionTokens.SUBSCRIPTION_REPOSITORY_INTERFACE,
      useClass: SubscriptionRepository,
    },
    {
      provide: subscriptionTokens.LINK_SERVICE_INTERFACE,
      useClass: LinkService,
    },
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
