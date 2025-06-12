import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '../../entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailSenderService } from '../email/email-sender.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, EmailSenderService],
  exports: [SubscriptionService, EmailSenderService],
})
export class SubscriptionModule {}
