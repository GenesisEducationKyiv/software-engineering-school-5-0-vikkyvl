import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { Errors } from '../../common/errors';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async get(@Query('city') city: string): Promise<WeatherService> {
    try {
      return await this.weatherService.getWeather(city);
    } catch (error: any) {
      const err = error as Errors;
      const status = err?.status || err?.statusCode;
      const message = err.message || err?.response?.message;

      if (status === 404) {
        throw new NotFoundException(message);
      }

      if (status === 400) {
        throw new BadRequestException(message);
      }

      throw new InternalServerErrorException('Failed');
    }
  }
}
