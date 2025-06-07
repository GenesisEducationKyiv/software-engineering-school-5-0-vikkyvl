import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors } from '../errors';
import { MessageResponseDto } from '../common/dto/message-response.dto';

@Injectable()
export class UnsubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async unsubscribe(token: string): Promise<MessageResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { token },
    });

    if (!subscription) {
      throw new RpcException(subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN);
    }

    await this.subscriptionRepository.remove(subscription);
    return { message: 'Unsubscribed successfully' };
  }
}
