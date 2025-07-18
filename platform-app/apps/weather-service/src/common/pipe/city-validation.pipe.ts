import { PipeTransform } from '@nestjs/common';
import { InvalidRequest } from '../exceptions';
import { WeatherRequestDto } from '../../../../../common/shared';

export class CityValidationPipe implements PipeTransform {
  transform(value: WeatherRequestDto): WeatherRequestDto {
    const hasNonAlphabetChars = /[^\p{L}\s-]/u.test(value.city);

    if (hasNonAlphabetChars) {
      throw new InvalidRequest();
    }

    return value;
  }
}
