import { subscriptionErrors } from '../constantas';
import { RpxExceptionHandler } from './rpx-exception-handler';

export class UnexpectedError extends RpxExceptionHandler {
  constructor() {
    super(subscriptionErrors.UNEXPECTED_ERROR);
  }
}
