import {Page} from "@playwright/test";
import {Frequency} from "../utils/enums/frequency.enum";
import {SubscriptionDto} from "../utils/dtos/subscription.dto";
import {MessageResponseDto} from "../utils/dtos/message-response.dto";

export class SubscriptionFormPage{
    constructor(private page: Page) {}

    async goto() {
        await this.page.goto('/');
    }

    async fillForm(subscriptionData: SubscriptionDto): Promise<MessageResponseDto> {
        await this.fillEmail(subscriptionData.email);
        await this.fillCity(subscriptionData.city);
        await this.fillFrequency(subscriptionData.frequency);
        await this.submit();

        const message = await this.getSuccessMessage();
        return { message };
    }

    private async fillEmail(email: string): Promise<void> {
        await this.page.fill('input[type="email"]', email);
    }

    private async fillCity(city: string): Promise<void> {
        await this.page.fill('input[type="text"]', city);
    }

    private async fillFrequency(frequency: Frequency): Promise<void> {
        await this.page.selectOption('select', frequency);
    }

    private async submit(): Promise<void> {
        await this.page.click('button[type="submit"]');
    }

    private async getSuccessMessage(): Promise<string> {
        return await this.page.textContent('form p');
    }
}