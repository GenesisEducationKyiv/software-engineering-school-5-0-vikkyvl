import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../../../entities/subscription.entity';
import { SubscriptionRepositoryInterface } from './interfaces/subscription.repository.interface';

@Injectable()
export class SubscriptionRepository implements SubscriptionRepositoryInterface {
  constructor(
    @InjectRepository(Subscription)
    private readonly weatherRepository: Repository<Subscription>,
  ) {}

  findByEmail(email: string): Promise<Subscription | null> {
    return this.weatherRepository.findOne({ where: { email } });
  }

  findByToken(token: string): Promise<Subscription | null> {
    return this.weatherRepository.findOne({ where: { token } });
  }

  createSubscription(subscription: Partial<Subscription>): Subscription {
    return this.weatherRepository.create(subscription);
  }

  async saveSubscription(subscription: Subscription): Promise<Subscription> {
    return this.weatherRepository.save(subscription);
  }

  async deleteSubscription(subscription: Subscription): Promise<void> {
    await this.weatherRepository.remove(subscription);
  }
}
