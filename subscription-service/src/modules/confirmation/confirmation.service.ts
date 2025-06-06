import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors } from '../errors';

@Injectable()
export class ConfirmationService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async confirmSubscription(token: string): Promise<{ message: string }> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { token },
    });

    if (!subscription) {
      throw new RpcException(subscriptionErrors.INVALID_CONFIRMATION_TOKEN);
    }

    if (subscription.confirmed) {
      return { message: 'Subscription already successfully' };
    }

    subscription.confirmed = true;
    await this.subscriptionRepository.save(subscription);

    return { message: 'Subscription confirmed successfully' };
  }
}
