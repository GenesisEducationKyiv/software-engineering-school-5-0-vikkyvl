import {
  Body,
  Controller,
  InternalServerErrorException,
  ConflictException,
  Post,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from '../../../../../common/shared/dtos/subscription/subscription.dto';
import { Errors } from '../../common/errors';
import { MessageResponseDto } from '../../../../../common/shared/dtos/subscription/message-response.dto';

@Controller('subscribe')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() dto: SubscriptionDto): Promise<MessageResponseDto> {
    try {
      return await this.subscriptionService.createSubscription(dto);
    } catch (error: unknown) {
      const err = error as Errors;
      const status = err?.status || err?.statusCode;
      const message = err?.message || err?.response?.message;

      if (status === 409) {
        throw new ConflictException(message);
      }

      throw new InternalServerErrorException('Failed');
    }
  }
}
