import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '../../entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailSenderService } from '../mail/email/email-sender.service';
import { SubscriptionRepository } from '../repository/subscription.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    {
      provide: 'EmailSenderServiceInterface',
      useClass: EmailSenderService,
    },
    {
      provide: 'SubscriptionRepositoryInterface',
      useClass: SubscriptionRepository,
    },
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
