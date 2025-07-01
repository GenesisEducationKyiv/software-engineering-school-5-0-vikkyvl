import { SubscriptionDto } from "../dtos/subscription.dto";
import { Frequency } from "../enums/frequency.enum";

export class TestDataBuilder {
    private static readonly TEST_EMAIL = 'test_user@example.com';
    private static readonly TEST_CITY = 'Kyiv';
    private static readonly TEST_FREQUENCY = Frequency.DAILY;

    public static userExistingEmail(): SubscriptionDto {
        return {
            email: this.TEST_EMAIL,
            city: this.TEST_CITY,
            frequency: this.TEST_FREQUENCY,
        };
    }
}