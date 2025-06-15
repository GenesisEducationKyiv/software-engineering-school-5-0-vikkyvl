import { Module } from '@nestjs/common';
import { OrmModule } from './orm/orm.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ConfirmationModule } from './confirmation/confirmation.module';
import { UnsubscriptionModule } from './unsubscription/unsubscription.module';

@Module({
  imports: [
    OrmModule,
    SubscriptionModule,
    ConfirmationModule,
    UnsubscriptionModule,
  ],
})
export class ModulesModule {}
