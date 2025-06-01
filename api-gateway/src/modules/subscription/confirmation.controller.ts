import {Controller, Get, NotFoundException, Param} from '@nestjs/common';
import {ConfirmationService} from "./confirmation.service";

@Controller('confirm')
export class ConfirmationController {
    constructor(private readonly confirmationService: ConfirmationService) {}

    @Get(':token')
    async confirm(@Param('token') token: string) {
        try {
            return await this.confirmationService.confirmSubscription(token);
        } catch (err: any) {
            if (err?.status === 404) {
                throw new NotFoundException(err.message);
            }
            throw new Error('Failed to confirm subscription');
        }
    }
}
