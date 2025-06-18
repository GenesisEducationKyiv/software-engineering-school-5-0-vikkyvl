import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { Errors } from '../../common/errors';
import { MessageResponseDto } from '../../../../../common/shared/dtos/subscription/message-response.dto';

@Controller('confirm')
export class ConfirmationController {
  constructor(private readonly confirmationService: ConfirmationService) {}

  @Get(':token')
  async confirm(@Param('token') token: string): Promise<MessageResponseDto> {
    try {
      return await this.confirmationService.confirmSubscription(token);
    } catch (error: unknown) {
      const err = error as Errors;

      if (err?.status === 404) {
        throw new NotFoundException(err.message);
      }

      throw new Error('Failed to confirm subscription');
    }
  }
}
