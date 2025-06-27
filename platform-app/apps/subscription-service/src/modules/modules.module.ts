import { Module } from '@nestjs/common';
import { OrmModule } from './orm/orm.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [OrmModule, SubscriptionModule],
})
export class ModulesModule {}
