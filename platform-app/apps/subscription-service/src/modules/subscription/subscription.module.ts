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

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    ConfirmationService,
    UnsubscriptionService,
    EmailSenderService,
    {
      provide: 'TransporterInterface',
      useClass: Transporter,
    },
    {
      provide: 'SubscriptionRepositoryInterface',
      useClass: SubscriptionRepository,
    },
    {
      provide: 'LinkServiceInterface',
      useClass: LinkService,
    },
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
