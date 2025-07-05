import { Controller, Get, Inject, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ErrorHandlerInterface } from '../../shared/handlers/interfaces';
import { WeatherResponseDto } from '../../../../../common/shared';
import { errorMessages } from '../../common';
import { WeatherRequestDto } from '../../../../../common/shared';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    @Inject('ErrorHandlerInterface')
    private readonly errorHandlerService: ErrorHandlerInterface,
  ) {}

  @Get()
  async get(@Query() dto: WeatherRequestDto): Promise<WeatherResponseDto> {
    try {
      return await this.weatherService.getWeather(dto.city);
    } catch (error: unknown) {
      this.errorHandlerService.handleError(error, errorMessages.WEATHER.FAILED);
    }
  }
}
