import { Module } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { apiConfigService } from '../../../../../common/config';

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    {
      provide: 'SUBSCRIPTION_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [apiConfigService.getBrokerUrl()],
            queue: 'subscription-service',
            queueOptions: { durable: false },
          },
        } as ClientOptions),
    },
  ],
})
export class SubscriptionModule {}
