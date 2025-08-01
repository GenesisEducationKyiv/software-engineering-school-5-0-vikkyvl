import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { patternsRMQ } from '../../../../../common/shared';
import { NotificationDto } from '../../../../../common/shared/dtos/subscription/notification.dto';
import { Channel, Message } from 'amqplib';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(patternsRMQ.SUBSCRIPTION.CREATED_SUBSCRIPTION)
  async sendMessage(
    @Payload() dto: NotificationDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    try {
      await this.notificationService.sendSubscriptionNotification(
        dto.email,
        dto.token,
      );
      channel.ack(originalMsg);
    } catch {
      channel.nack(originalMsg, false, true);
    }
  }
}
