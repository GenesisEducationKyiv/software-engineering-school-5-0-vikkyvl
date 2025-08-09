import { Controller, Logger } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { patternsRMQ } from '../../../../../common/shared';
import { NotificationDto } from '../../../../../common/shared/dtos/subscription/notification.dto';
import { Channel, Message } from 'amqplib';
import { EmailSendingFailed } from '../../common';
import { MetricsService } from '../observability/metrics.service';
import { Status } from '../../common';

@Controller()
export class NotificationController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly metricsService: MetricsService,
  ) {}

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

      this.metricsService.incrementSubscriptionSendingEmailCounter(
        Status.SUCCESS,
      );

      channel.ack(originalMsg);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new EmailSendingFailed();
      this.logger.error(err);

      this.metricsService.incrementSubscriptionSendingEmailCounter(
        Status.FAILED,
      );

      channel.nack(originalMsg, false, true);
    }
  }
}
