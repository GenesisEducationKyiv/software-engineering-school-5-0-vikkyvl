import { Injectable } from '@nestjs/common';
import { Errors } from '../../common';
import { ConflictException } from './exceptions';
import { NotFoundException } from './exceptions';
import { InternalServerErrorException } from './exceptions';
import { BadRequestException } from './exceptions/bad-request-exception';
import { ErrorHandlerInterface } from './interfaces';
import { ErrorsCode } from '../../../../../common/shared';

@Injectable()
export class ErrorHandlerService implements ErrorHandlerInterface {
  constructor() {}

  handleError(error: unknown, defaultMessage: string): never {
    let responseMessage: string = defaultMessage;
    const err = error as Errors;

    if (err.details) {
      responseMessage = err.details;
    } else if (err.message) {
      responseMessage = err.message;
    }

    if (err.status === 409 || err.code === ErrorsCode.ABORTED) {
      throw new ConflictException(responseMessage);
    }

    if (err.status === 404 || err.code === ErrorsCode.NOT_FOUND) {
      throw new NotFoundException(responseMessage);
    }

    if (err.status === 400 || err.code === ErrorsCode.INVALID_ARGUMENT) {
      throw new BadRequestException(responseMessage);
    }

    if (err.status === 500 || err.code === ErrorsCode.UNKNOWN) {
      throw new InternalServerErrorException(responseMessage);
    }

    throw new InternalServerErrorException(responseMessage);
  }
}
