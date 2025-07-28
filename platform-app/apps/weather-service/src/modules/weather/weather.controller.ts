import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { patterns } from '../../../../../common/shared';
import { WeatherResponseDto } from '../../../../../common/shared';
import { WeatherService } from './weather.service';
import { CityValidationPipe } from '../../common/pipe/city-validation.pipe';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @MessagePattern(patterns.WEATHER.GET_WEATHER)
  async getWeather(
    @Payload(new CityValidationPipe()) city: string,
  ): Promise<WeatherResponseDto> {
    return await this.weatherService.getWeatherFromAPI(city);
  }
}
