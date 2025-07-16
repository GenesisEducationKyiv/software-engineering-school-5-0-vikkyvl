import { Body, Controller, Post, Param, Get, UseFilters } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRequestDto } from '../../../../../common/shared';
import { MessageResponseDto } from '../../../../../common/shared';
import { TokenRequestDto } from '../../../../../common/shared/dtos/subscription/token-request.dto';
import { ErrorHandlerFilter } from '../../shared';
import { errorMessages } from '../../common';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @UseFilters(new ErrorHandlerFilter(errorMessages.SUBSCRIPTION.FAILED))
  async create(
    @Body() dto: SubscriptionRequestDto,
  ): Promise<MessageResponseDto> {
    return await this.subscriptionService.createSubscription(dto);
  }

  @Get('confirm/:token')
  @UseFilters(new ErrorHandlerFilter(errorMessages.CONFIRMATION.FAILED))
  async confirm(@Param() dto: TokenRequestDto): Promise<MessageResponseDto> {
    return await this.subscriptionService.confirmSubscription(dto.token);
  }

  @Get('unsubscribe/:token')
  @UseFilters(new ErrorHandlerFilter(errorMessages.UNSUBSCRIPTION.FAILED))
  async remove(@Param() dto: TokenRequestDto): Promise<MessageResponseDto> {
    return await this.subscriptionService.unsubscribeSubscription(dto.token);
  }
}
