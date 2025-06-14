import { Controller } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { MessagePattern } from '@nestjs/microservices';
import { patterns } from '../../../../../common/shared/constants/patterns';
import { MessageResponseDto } from '../../../../../common/shared/dtos/subscription/message-response.dto';

@Controller('confirm')
export class ConfirmationController {
  constructor(private readonly confirmationService: ConfirmationService) {}

  @MessagePattern(patterns.CONFIRMATION.GET_TOKEN)
  async getTokenConfirmation(token: string): Promise<MessageResponseDto> {
    return this.confirmationService.confirmSubscription(token);
  }
}
