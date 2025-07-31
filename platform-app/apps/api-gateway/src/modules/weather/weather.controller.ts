import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherResponseDto } from '../../../../../common/shared';
import { WeatherRequestDto } from '../../../../../common/shared';
import { ErrorHandlerFilter } from '../../shared';
import { errorMessages } from '../../common';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UseFilters(new ErrorHandlerFilter(errorMessages.WEATHER.FAILED))
  async get(@Query() dto: WeatherRequestDto): Promise<WeatherResponseDto> {
    return await this.weatherService.getWeather(dto.city);
  }
}
