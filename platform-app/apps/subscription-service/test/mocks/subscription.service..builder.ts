import { Frequency } from '../../../../common/shared';
import { SubscriptionDto } from '../../../../common/shared';
import { Subscription } from '../../src/entities/subscription.entity';

export class SubscriptionServiceBuilder {
  private static readonly TEST_ID = '3bb0229e-4cad-40c3-af6d-c80ba314d92c';
  private static readonly TEST_EMAIL = 'test_user@example.com';
  private static readonly TEST_EXISTING_EMAIL = 'existing_user@example.com';
  private static readonly TEST_WRONG_EMAIL = 'wrong_user@example.com';
  private static readonly TEST_CITY = 'Kyiv';
  private static readonly TEST_FREQUENCY = Frequency.DAILY;
  private static readonly TEST_TOKEN = '5ffa803-6e9a-4f55-8fb8-09e60f464095';
  private static readonly TEST_CREATED_AT: Date = new Date(
    '2024-01-01T00:00:00Z',
  );
  private static readonly TEST_UPDATE_AT: Date = new Date(
    '2024-01-01T00:00:00Z',
  );

  public static userFormWithExistingEmail(): SubscriptionDto {
    return {
      email: this.TEST_EXISTING_EMAIL,
      city: this.TEST_CITY,
      frequency: this.TEST_FREQUENCY,
    };
  }

  public static userFormWithWrongEmail(): SubscriptionDto {
    return {
      email: this.TEST_WRONG_EMAIL,
      city: this.TEST_CITY,
      frequency: this.TEST_FREQUENCY,
    };
  }

  public static subscriptionEntity(confirmed: boolean = false): Subscription {
    return {
      id: this.TEST_ID,
      email: this.TEST_EMAIL,
      city: this.TEST_CITY,
      frequency: this.TEST_FREQUENCY,
      token: this.TEST_TOKEN,
      confirmed,
      createdAt: this.TEST_CREATED_AT,
      updatedAt: this.TEST_UPDATE_AT,
    };
  }
}
