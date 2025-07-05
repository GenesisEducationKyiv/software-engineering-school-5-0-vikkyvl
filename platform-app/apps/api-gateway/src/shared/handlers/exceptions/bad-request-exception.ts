import { Exception } from './exception';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends Exception {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
