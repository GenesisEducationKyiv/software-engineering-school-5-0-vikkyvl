import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { patterns } from '../../../../../common/shared';
import { WeatherDto } from '../../../../../common/shared';
import { weatherErrors } from '../../common';
import { WeatherServiceInterface } from './interface';

@Controller('weather')
export class WeatherController {
  constructor(
    @Inject('WeatherServiceInterface')
    private weatherService: WeatherServiceInterface,
  ) {}

  @MessagePattern(patterns.WEATHER.GET_WEATHER)
  async getWeather(city: string): Promise<WeatherDto> {
    const hasNonAlphabetChars = /[^\p{L}\s-]/u.test(city);

    if (hasNonAlphabetChars) {
      throw new RpcException(weatherErrors.INVALID_REQUEST);
    }

    return this.weatherService.getWeatherFromAPI(city);
  }
}
