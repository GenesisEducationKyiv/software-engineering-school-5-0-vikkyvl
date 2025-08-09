import { Module } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import {
  apiConfigService,
  subscriptionConfigService,
} from '../../../../../common/config';
import { serviceTokens } from '../../common';

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    {
      provide: serviceTokens.SUBSCRIPTION_SERVICE,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [apiConfigService.getBrokerUrl()],
            queue: subscriptionConfigService.getQueueName(),
            persistent: true,
            queueOptions: {
              durable: true,
              arguments: {
                'x-message-ttl': subscriptionConfigService.getTTL(),
              },
            },
          },
        } as ClientOptions),
    },
  ],
})
export class SubscriptionModule {}
