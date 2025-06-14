import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { UnsubscriptionController } from './unsubscription.controller';
import { UnsubscriptionService } from './unsubscription.service';
import { SubscriptionRepository } from '../repository/subscription.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [UnsubscriptionController],
  providers: [
    UnsubscriptionService,
    {
      provide: 'SubscriptionRepositoryInterface',
      useClass: SubscriptionRepository,
    },
  ],
})
export class UnsubscriptionModule {}
