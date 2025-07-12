import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ConfirmationService } from './confirmation.service';
import { UnsubscriptionService } from './unsubscription.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { SubscriptionRequestDto } from '../../../../../common/shared';
import { patterns } from '../../../../../common/shared';
import { MessageResponseDto } from '../../../../../common/shared';
import { DomainException, UnexpectedError } from '../../common';

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
    try {
      return await this.subscriptionService.formSubscription(data);
    } catch (error: unknown) {
      if (error instanceof DomainException) {
        throw new RpcException({
          status: error.getStatus(),
          message: error.getMessage(),
        });
      }

      throw new UnexpectedError();
    }
  }

  @MessagePattern(patterns.CONFIRMATION.GET_TOKEN)
  async getTokenConfirmation(token: string): Promise<MessageResponseDto> {
    try {
      return await this.confirmationService.confirmSubscription(token);
    } catch (error: unknown) {
      if (error instanceof DomainException) {
        throw new RpcException({
          status: error.getStatus(),
          message: error.getMessage(),
        });
      }

      throw new UnexpectedError();
    }
  }

  @MessagePattern(patterns.UNSUBSCRIPTION.GET_TOKEN)
  async getTokenUnsubscription(token: string): Promise<MessageResponseDto> {
    try {
      return await this.unsubscriptionService.unsubscribeSubscription(token);
    } catch (error: unknown) {
      if (error instanceof DomainException) {
        throw new RpcException({
          status: error.getStatus(),
          message: error.getMessage(),
        });
      }

      throw new UnexpectedError();
    }
  }
}
