import { Controller } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {MessagePattern} from "@nestjs/microservices";
import { SubscriptionDto } from './dto/subscription.dto';
import { patterns } from "../patterns";

@Controller('subscribe')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @MessagePattern(patterns.SUBSCRIPTION.CREATE_SUBSCRIPTION)
    async createSubscription(data: SubscriptionDto) {
        return this.subscriptionService.formSubscription(data);
    }
}
