import { Module } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { configService } from '../../../../../common/config/api-gateway-config.service';

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
            urls: [configService.getBrokerUrl()],
            queue: 'subscription-service',
            queueOptions: { durable: false },
          },
        } as ClientOptions),
    },
  ],
})
export class SubscriptionModule {}
