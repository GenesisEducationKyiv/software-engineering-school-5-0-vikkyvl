import { Frequency } from '../../../common/frequency.enum';

export interface SubscriptionDto {
  email: string;
  city: string;
  frequency: Frequency;
}
