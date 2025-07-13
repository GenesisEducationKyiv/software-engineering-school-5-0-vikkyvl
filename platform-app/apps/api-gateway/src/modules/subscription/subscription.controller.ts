import { Body, Controller, Post, Param, Get, Inject } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRequestDto } from '../../../../../common/shared';
import { MessageResponseDto } from '../../../../../common/shared';
import { errorMessages, sharedTokens } from '../../common';
import { ErrorHandlerInterface } from '../../shared/handlers/interfaces';
import { TokenRequestDto } from '../../../../../common/shared/dtos/subscription/token-request.dto';

@Controller()
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    @Inject(sharedTokens.ERROR_HANDLER_INTERFACE)
    private readonly errorHandlerService: ErrorHandlerInterface,
  ) {}

  @Post('subscribe')
  async create(
    @Body() dto: SubscriptionRequestDto,
  ): Promise<MessageResponseDto> {
    try {
      return await this.subscriptionService.createSubscription(dto);
    } catch (error: unknown) {
      this.errorHandlerService.handleError(
        error,
        errorMessages.SUBSCRIPTION.FAILED,
      );
    }
  }

  @Get('confirm/:token')
  async confirm(@Param() dto: TokenRequestDto): Promise<MessageResponseDto> {
    try {
      return await this.subscriptionService.confirmSubscription(dto);
    } catch (error: unknown) {
      this.errorHandlerService.handleError(
        error,
        errorMessages.CONFIRMATION.FAILED,
      );
    }
  }

  @Get('unsubscribe/:token')
  async remove(@Param() dto: TokenRequestDto): Promise<MessageResponseDto> {
    try {
      return await this.subscriptionService.unsubscribeSubscription(dto);
    } catch (error: unknown) {
      this.errorHandlerService.handleError(
        error,
        errorMessages.UNSUBSCRIPTION.FAILED,
      );
    }
  }
}
