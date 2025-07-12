import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { patterns } from '../../../../../common/shared';
import { WeatherResponseDto } from '../../../../../common/shared';
import { DomainException, IntervalError, InvalidRequest } from '../../common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @MessagePattern(patterns.WEATHER.GET_WEATHER)
  async getWeather(city: string): Promise<WeatherResponseDto> {
    const hasNonAlphabetChars = /[^\p{L}\s-]/u.test(city);

    if (hasNonAlphabetChars) {
      throw new InvalidRequest();
    }

    try {
      return await this.weatherService.getWeatherFromAPI(city);
    } catch (error: unknown) {
      if (error instanceof DomainException) {
        throw new RpcException({
          status: error.getStatus(),
          message: error.getMessage(),
        });
      }

      throw new IntervalError();
    }
  }
}
