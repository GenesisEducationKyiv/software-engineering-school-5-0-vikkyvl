import { Controller } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { MessagePattern } from '@nestjs/microservices';
import { patterns } from '../patterns';
import { MessageResponseDto } from '../common/dto/message-response.dto';

@Controller('confirm')
export class ConfirmationController {
  constructor(private readonly confirmationService: ConfirmationService) {}

  @MessagePattern(patterns.CONFIRMATION.GET_TOKEN)
  async getTokenConfirmation(token: string): Promise<MessageResponseDto> {
    return this.confirmationService.confirmSubscription(token);
  }
}
