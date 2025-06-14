import { Module } from '@nestjs/common';
import { Subscription } from '../../entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfirmationService } from './confirmation.service';
import { ConfirmationController } from './confirmation.controller';
import { SubscriptionRepository } from '../repository/subscription.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [ConfirmationController],
  providers: [
    ConfirmationService,
    {
      provide: 'SubscriptionRepositoryInterface',
      useClass: SubscriptionRepository,
    },
  ],
})
export class ConfirmationModule {}
