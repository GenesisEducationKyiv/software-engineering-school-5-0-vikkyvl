import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ConfirmationService } from './confirmation.service';
import { UnsubscriptionService } from './unsubscription.service';
import { MessagePattern } from '@nestjs/microservices';
import { SubscriptionRequestDto } from '../../../../../common/shared';
import { patternsRMQ } from '../../../../../common/shared';
import { MessageResponseDto } from '../../../../../common/shared';
import { TokenRequestDto } from '../../../../../common/shared/dtos/subscription/token-request.dto';

@Controller()
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly confirmationService: ConfirmationService,
    private readonly unsubscriptionService: UnsubscriptionService,
  ) {}

  @MessagePattern(patternsRMQ.SUBSCRIPTION.CREATE_SUBSCRIPTION)
  async createSubscription(
    dto: SubscriptionRequestDto,
  ): Promise<MessageResponseDto> {
    return await this.subscriptionService.formSubscription(dto);
  }

  @MessagePattern(patternsRMQ.CONFIRMATION.GET_TOKEN)
  async getTokenConfirmation(
    dto: TokenRequestDto,
  ): Promise<MessageResponseDto> {
    return await this.confirmationService.confirmSubscription(dto.token);
  }

  @MessagePattern(patternsRMQ.UNSUBSCRIPTION.GET_TOKEN)
  async getTokenUnsubscription(
    dto: TokenRequestDto,
  ): Promise<MessageResponseDto> {
    return await this.unsubscriptionService.unsubscribeSubscription(dto.token);
  }
}
