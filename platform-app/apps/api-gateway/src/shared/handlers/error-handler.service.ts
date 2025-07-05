import { Injectable } from '@nestjs/common';
import { Errors } from '../../common';
import { ConflictException } from './exceptions';
import { NotFoundException } from './exceptions';
import { InternalServerErrorException } from './exceptions';
import { BadRequestException } from './exceptions/bad-request-exception';
import { ErrorHandlerInterface } from './interfaces';

@Injectable()
export class ErrorHandlerService implements ErrorHandlerInterface {
  constructor() {}

  handleError(error: unknown, defaultMessage: string): never {
    const err = error as Errors;

    if (err.status === 409) {
      throw new ConflictException(err.message);
    }

    if (err.status === 404) {
      throw new NotFoundException(err.message);
    }

    if (err.status === 400) {
      throw new BadRequestException(err.message);
    }

    throw new InternalServerErrorException(defaultMessage);
  }
}
