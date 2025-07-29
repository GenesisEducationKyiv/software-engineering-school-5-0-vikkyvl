import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CityValidationPipe } from '../../common';
import {
  WeatherRequestHttpDto,
  WeatherResponseHttpDto,
} from '../../../../../common/shared';

@Controller('weather')
export class WeatherHttpController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  async getWeatherHttp(
    @Query(new CityValidationPipe()) dto: WeatherRequestHttpDto,
  ): Promise<WeatherResponseHttpDto> {
    return await this.weatherService.getWeatherFromAPI(dto.city);
  }
}
