import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ConfirmationService } from './confirmation.service';
import { UnsubscriptionService } from './unsubscription.service';
import { MessagePattern } from '@nestjs/microservices';
import { SubscriptionRequestDto } from '../../../../../common/shared';
import { patterns } from '../../../../../common/shared';
import { MessageResponseDto } from '../../../../../common/shared';

@Controller()
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly confirmationService: ConfirmationService,
    private readonly unsubscriptionService: UnsubscriptionService,
  ) {}

  @MessagePattern(patterns.SUBSCRIPTION.CREATE_SUBSCRIPTION)
  async createSubscription(
    data: SubscriptionRequestDto,
  ): Promise<MessageResponseDto> {
    return this.subscriptionService.formSubscription(data);
  }

  @MessagePattern(patterns.CONFIRMATION.GET_TOKEN)
  async getTokenConfirmation(token: string): Promise<MessageResponseDto> {
    return this.confirmationService.confirmSubscription(token);
  }

  @MessagePattern(patterns.UNSUBSCRIPTION.GET_TOKEN)
  async getTokenUnsubscription(token: string): Promise<MessageResponseDto> {
    return this.unsubscriptionService.unsubscribeSubscription(token);
  }
}
