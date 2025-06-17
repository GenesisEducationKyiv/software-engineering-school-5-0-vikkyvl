import { test, expect } from '@playwright/test';
import { SubscriptionFormPage } from "../pages/SubscriptionForm";
import { TestDataBuilder } from "../utils/mocks/test.data.builder";
import { response } from "../utils/consts/response";

// User flow: User has a subscription:

// Precondition:
// The email test_user@example.com is already subscribed and confirmed.

// Steps:
// 1. Go to the page: http://localhost:3004.
// 2. In the Email field, enter: test_user@example.com.
// 3. In the City field, enter: test_user@example.com.
// 4. In the Frequency dropdown, select: Daily.
// 5. Click the Subscribe button.

// Expected Result:
// The user sees an error or warning message:
// 'Email already subscribed'

test('user has a subscription', async ({ page }) => {
    const subscriptionFormPage = new SubscriptionFormPage(page);
    const testData = TestDataBuilder.userExistingEmail();

    await subscriptionFormPage.goto()
    const formResponse = await subscriptionFormPage.fillForm(testData);

    expect(formResponse.message).toEqual(response.EMAIL_ALREADY_SUBSCRIBED);
});