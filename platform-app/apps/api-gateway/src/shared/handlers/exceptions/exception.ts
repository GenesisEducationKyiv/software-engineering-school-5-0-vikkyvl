import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class Exception extends HttpException {
  protected constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
