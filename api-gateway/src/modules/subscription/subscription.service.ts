import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubscriptionDto } from './dto/subscription.dto';
import { patterns } from '../patterns';
import { MicroserviceClient } from '../../common/microservice-client';
import { UnsubscriptionService } from './unsubscription.service';

@Injectable()
export class SubscriptionService extends MicroserviceClient {
  constructor(
    @Inject('SUBSCRIPTION_SERVICE')
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async createSubscription(
    dto: SubscriptionDto,
  ): Promise<UnsubscriptionService> {
    return this.send(patterns.SUBSCRIPTION.CREATE_SUBSCRIPTION, dto);
  }
}
