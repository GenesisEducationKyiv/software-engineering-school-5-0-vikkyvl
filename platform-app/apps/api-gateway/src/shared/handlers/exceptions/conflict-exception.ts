import { Exception } from './exception';
import { HttpStatus } from '@nestjs/common';

export class ConflictException extends Exception {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
