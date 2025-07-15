import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Errors } from '../../common';
import { WeatherDto } from '../../../../../common/shared';
import { errorMessages } from '../../common';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async get(@Query('city') city: string): Promise<WeatherDto> {
    try {
      return await this.weatherService.getWeather(city);
    } catch (error: unknown) {
      const err = error as Errors;

      if (err?.status === 404) {
        throw new NotFoundException(err.message);
      }

      if (err?.status === 400) {
        throw new BadRequestException(err.message);
      }

      throw new InternalServerErrorException(errorMessages.WEATHER.FAILED);
    }
  }
}
