import { Frequency } from '../../../../common/shared/enums/frequency.enum';
import { SubscriptionDto } from '../../../../common/shared/dtos/subscription/subscription.dto';

export class SubscriptionBuilder {
  private static readonly TEST_EMAIL = 'test_user@example.com';
  private static readonly TEST_CITY = 'Kyiv';
  private static readonly TEST_FREQUENCY = Frequency.DAILY;
  private static readonly TEST_CONFIRMATION_LINK =
    'https://example.com/confirm?token=1234567890abcdef';
  private static readonly TEST_UNSUBSCRIBE_LINK =
    'https://example.com/unsubscribe?token=1234567890abcdef';
  private static readonly TEST_TOKEN = '-5ffa803-6e9a-4f55-8fb8-09e60f464095';

  public static userForm(): SubscriptionDto {
    return {
      email: this.TEST_EMAIL,
      city: this.TEST_CITY,
      frequency: this.TEST_FREQUENCY,
    };
  }

  public static links(): { confirmLink: string; unsubscribeLink: string } {
    return {
      confirmLink: this.TEST_CONFIRMATION_LINK,
      unsubscribeLink: this.TEST_UNSUBSCRIBE_LINK,
    };
  }

  public static invalidToken(): string {
    return this.TEST_TOKEN;
  }
}
