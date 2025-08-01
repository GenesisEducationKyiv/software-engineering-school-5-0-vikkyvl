import { Module } from '@nestjs/common';
import { OrmModule } from './orm/orm.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [OrmModule, SubscriptionModule, NotificationModule],
})
export class ModulesModule {}
