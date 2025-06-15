import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { patterns } from '../../../../../common/shared/constants/patterns';
import { MicroserviceClient } from '../../common/microservice-client';
import { MessageResponseDto } from '../../../../../common/shared/dtos/subscription/message-response.dto';

@Injectable()
export class ConfirmationService extends MicroserviceClient {
  constructor(
    @Inject('SUBSCRIPTION_SERVICE')
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async confirmSubscription(token: string): Promise<MessageResponseDto> {
    return this.send(patterns.CONFIRMATION.GET_TOKEN, token);
  }
}
