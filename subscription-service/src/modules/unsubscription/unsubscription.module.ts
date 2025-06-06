import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { UnsubscriptionController } from './unsubscription.controller';
import { UnsubscriptionService } from './unsubscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [UnsubscriptionController],
  providers: [UnsubscriptionService],
})
export class UnsubscriptionModule {}
