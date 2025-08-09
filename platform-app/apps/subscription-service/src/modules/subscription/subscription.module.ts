import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '../../entities/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionRepository } from './infrastructure/repository/subscription.repository';
import { ConfirmationService } from './confirmation.service';
import { UnsubscriptionService } from './unsubscription.service';
import { subscriptionTokens } from '../../common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { notificationConfigService } from '../../../../../common/config';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    ConfirmationService,
    UnsubscriptionService,
    {
      provide: subscriptionTokens.SUBSCRIPTION_REPOSITORY_INTERFACE,
      useClass: SubscriptionRepository,
    },
    {
      provide: subscriptionTokens.NOTIFICATION_EVENT_SERVICE,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [notificationConfigService.getBrokerUrl()],
            queue: notificationConfigService.getQueueName(),
            persistent: true,
            queueOptions: {
              durable: true,
              arguments: {
                'x-message-ttl': notificationConfigService.getTTL(),
              },
            },
          },
        } as ClientOptions),
    },
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
