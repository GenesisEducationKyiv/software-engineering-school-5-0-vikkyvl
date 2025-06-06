export interface SubscriptionDto {
  email: string;
  city: string;
  frequency: 'daily' | 'hourly';
}
