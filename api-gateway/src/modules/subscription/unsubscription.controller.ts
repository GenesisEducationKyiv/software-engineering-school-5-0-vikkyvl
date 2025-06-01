import {Controller, Get, NotFoundException, Param} from '@nestjs/common';
import {UnsubscriptionService} from "./unsubscription.service";

@Controller('unsubscribe')
export class UnsubscriptionController {
    constructor(private readonly unsubscriptionService: UnsubscriptionService) {}

    @Get(':token')
    async remove(@Param('token') token: string) {
        try {
            return await this.unsubscriptionService.unsubscribe(token);
        } catch (err: any) {
            if (err?.status === 404) {
                throw new NotFoundException(err.message);
            }
            throw new Error('Failed to confirm unsubscription');
        }
    }
}
