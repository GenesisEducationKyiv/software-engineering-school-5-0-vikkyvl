import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { MessagePattern } from '@nestjs/microservices';
import { SubscriptionDto } from '../../../../../common/shared/dtos/subscription/subscription.dto';
import { patterns } from '../../../../../common/shared/constants/patterns';
import { MessageResponseDto } from '../../../../../common/shared/dtos/subscription/message-response.dto';

@Controller('subscribe')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @MessagePattern(patterns.SUBSCRIPTION.CREATE_SUBSCRIPTION)
  async createSubscription(data: SubscriptionDto): Promise<MessageResponseDto> {
    return this.subscriptionService.formSubscription(data);
  }
}
