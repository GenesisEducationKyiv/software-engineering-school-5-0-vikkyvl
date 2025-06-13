import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { MessagePattern } from '@nestjs/microservices';
import { SubscriptionDto } from './dto/subscription.dto';
import { patterns } from '../patterns';
import { MessageResponseDto } from '../common/dto/message-response.dto';

@Controller('subscribe')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @MessagePattern(patterns.SUBSCRIPTION.CREATE_SUBSCRIPTION)
  async createSubscription(data: SubscriptionDto): Promise<MessageResponseDto> {
    return this.subscriptionService.formSubscription(data);
  }
}
