import { PipeTransform } from '@nestjs/common';
import { InvalidRequest } from '../exceptions';

export class CityValidationPipe implements PipeTransform {
  transform(value: string): string {
    const hasNonAlphabetChars = /[^\p{L}\s-]/u.test(value);

    if (hasNonAlphabetChars) {
      throw new InvalidRequest();
    }

    return value;
  }
}
