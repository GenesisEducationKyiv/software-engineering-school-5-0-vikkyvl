import { Subscription } from '../../../../../entities/subscription.entity';

export interface SubscriptionRepositoryInterface {
  findByEmail(email: string): Promise<Subscription | null>;
  findByToken(token: string): Promise<Subscription | null>;
  createSubscription(subscription: Partial<Subscription>): Subscription;
  saveSubscription(subscription: Subscription): Promise<Subscription>;
  deleteSubscription(subscription: Subscription): Promise<void>;
}
