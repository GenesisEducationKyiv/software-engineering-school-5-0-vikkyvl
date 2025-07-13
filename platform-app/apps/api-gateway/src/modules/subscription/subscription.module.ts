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
import { ErrorHandlerService } from '../../shared';
import { serviceTokens, sharedTokens } from '../../common';

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    {
      provide: sharedTokens.ERROR_HANDLER_INTERFACE,
      useClass: ErrorHandlerService,
    },
    {
      provide: serviceTokens.SUBSCRIPTION_SERVICE,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [apiConfigService.getBrokerUrl()],
            queue: subscriptionConfigService.getQueueName(),
            queueOptions: { durable: false },
          },
        } as ClientOptions),
    },
  ],
})
export class SubscriptionModule {}
