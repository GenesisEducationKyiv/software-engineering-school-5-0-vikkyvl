import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CityValidationPipe } from '../../common';
import {
  WeatherRequestHttpDto,
  WeatherResponseHttpDto,
} from '../../../../../common/shared';
import { HttpErrorHandlerFilter } from '../../common';

@Controller('weather')
@UseFilters(new HttpErrorHandlerFilter())
export class WeatherHttpController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  async getWeatherHttp(
    @Query(new CityValidationPipe()) dto: WeatherRequestHttpDto,
  ): Promise<WeatherResponseHttpDto> {
    return await this.weatherService.getWeatherFromAPI(dto.city);
  }
}
