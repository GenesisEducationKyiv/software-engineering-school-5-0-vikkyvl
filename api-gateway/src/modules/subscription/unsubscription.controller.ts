import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UnsubscriptionService } from './unsubscription.service';
import { Errors } from '../../common/errors';

@Controller('unsubscribe')
export class UnsubscriptionController {
  constructor(private readonly unsubscriptionService: UnsubscriptionService) {}

  @Get(':token')
  async remove(@Param('token') token: string): Promise<UnsubscriptionService> {
    try {
      return await this.unsubscriptionService.unsubscribe(token);
    } catch (error: unknown) {
      const err = error as Errors;
      if (err?.status === 404) {
        throw new NotFoundException(err.message);
      }
      throw new Error('Failed to confirm unsubscription');
    }
  }
}
