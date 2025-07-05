import { Exception } from './exception';
import { HttpStatus } from '@nestjs/common';

export class NotFoundException extends Exception {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
