import { weatherErrors } from '../constants';
import { RpxExceptionHandler } from './rpx-exception-handler';

export class InvalidRequest extends RpxExceptionHandler {
  constructor() {
    super(weatherErrors.INVALID_REQUEST);
  }
}
