import { Exception } from './exception';
import { HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends Exception {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
