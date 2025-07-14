import {
  Body,
  Controller,
  InternalServerErrorException,
  ConflictException,
  Post,
  NotFoundException,
  Param,
  Get,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from '../../../../../common/shared';
import { Errors } from '../../common';
import { MessageResponseDto } from '../../../../../common/shared';
import { errorMessages } from '../../common';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  async create(@Body() dto: SubscriptionDto): Promise<MessageResponseDto> {
    try {
      return await this.subscriptionService.createSubscription(dto);
    } catch (error: unknown) {
      const err = error as Errors;

      if (err?.status === 409) {
        throw new ConflictException(err.message);
      }

      throw new InternalServerErrorException(errorMessages.SUBSCRIPTION.FAILED);
    }
  }

  @Get('confirm/:token')
  async confirm(@Param('token') token: string): Promise<MessageResponseDto> {
    try {
      return await this.subscriptionService.confirmSubscription(token);
    } catch (error: unknown) {
      const err = error as Errors;

      if (err?.status === 404) {
        throw new NotFoundException(err.message);
      }

      throw new InternalServerErrorException(errorMessages.CONFIRMATION.FAILED);
    }
  }

  @Get('unsubscribe/:token')
  async remove(@Param('token') token: string): Promise<MessageResponseDto> {
    try {
      return await this.subscriptionService.unsubscribeSubscription(token);
    } catch (error: unknown) {
      const err = error as Errors;

      if (err?.status === 404) {
        throw new NotFoundException(err.message);
      }

      throw new InternalServerErrorException(
        errorMessages.UNSUBSCRIPTION.FAILED,
      );
    }
  }
}
