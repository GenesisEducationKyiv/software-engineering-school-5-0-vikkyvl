import { weatherErrors } from '../constants';
import { RpxExceptionHandler } from './rpx-exception-handler';

export class IntervalError extends RpxExceptionHandler {
  constructor() {
    super(weatherErrors.INTERNAL_ERROR);
  }
}
