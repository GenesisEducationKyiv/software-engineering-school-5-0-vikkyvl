import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { WeatherService } from './weather.service';
import { patterns } from '../../../../../common/shared/constants/patterns';
import { WeatherDto } from '../../../../../common/shared/dtos/weather/weather.dto';
import { weatherErrors } from '../errors';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @MessagePattern(patterns.WEATHER.GET_WEATHER)
  async getWeather(city: string): Promise<WeatherDto> {
    const hasNonAlphabetChars = /[^\p{L}\s-]/u.test(city);

    if (hasNonAlphabetChars) {
      throw new RpcException(weatherErrors.INVALID_REQUEST);
    }

    return this.weatherService.getWeatherFromAPI(city);
  }
}
