import { Module } from '@nestjs/common';
import {ClientProxyFactory, ClientsModule, Transport} from '@nestjs/microservices';
import {SubscriptionController} from "./subscription.controller";
import {SubscriptionService} from "./subscription.service";
import { ConfirmationService } from './confirmation.service';
import { ConfirmationController } from './confirmation.controller';
import { UnsubscriptionController } from './unsubscription.controller';
import { UnsubscriptionService } from './unsubscription.service';

@Module({
    controllers: [SubscriptionController, ConfirmationController, UnsubscriptionController],
    providers: [
        SubscriptionService, ConfirmationService, UnsubscriptionService,
        {
            provide: 'SUBSCRIPTION_SERVICE',
            useFactory: () =>
                ClientProxyFactory.create({
                    transport: Transport.RMQ,
                    options: {
                        urls: [process.env.BROKER_URL],
                        queue: 'subscription-service',
                        queueOptions: { durable: false },
                    },
                } as any),
        },
    ],
})
export class SubscriptionModule {}