import { Controller } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { MessagePattern } from '@nestjs/microservices';
import { patterns } from '../patterns';

@Controller('confirm')
export class ConfirmationController {
  constructor(private readonly confirmationService: ConfirmationService) {}

  @MessagePattern(patterns.CONFIRMATION.GET_TOKEN)
  async getTokenConfirmation(token: string) {
    return this.confirmationService.confirmSubscription(token);
  }
}
