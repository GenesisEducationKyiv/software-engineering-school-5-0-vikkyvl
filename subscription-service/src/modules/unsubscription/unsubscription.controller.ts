import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { patterns } from '../patterns';
import { UnsubscriptionService } from './unsubscription.service';
import { MessageResponseDto } from '../common/dto/message-response.dto';

@Controller('unsubscribe')
export class UnsubscriptionController {
  constructor(private readonly unsubscriptionService: UnsubscriptionService) {}

  @MessagePattern(patterns.UNSUBSCRIPTION.GET_TOKEN)
  async getTokenUnsubscription(
    @Payload() token: string,
  ): Promise<MessageResponseDto> {
    return this.unsubscriptionService.unsubscribe(token);
  }
}
