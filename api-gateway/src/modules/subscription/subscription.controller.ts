import {BadRequestException, Body, Controller, InternalServerErrorException, ConflictException, Post} from '@nestjs/common';
import {SubscriptionService} from "./subscription.service";
import {SubscriptionDto} from "./dto/subscription.dto";

@Controller('subscribe')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post()
    async create(@Body() dto: SubscriptionDto) {
        try {
            return await this.subscriptionService.createSubscription(dto);
        } catch (err: any) {
            const status = err?.status || err?.statusCode;
            const message = err?.message || err?.response?.message;

            if (status === 409) {
                throw new ConflictException(message);
            }

            throw new InternalServerErrorException('Failed');
        }
    }
}
