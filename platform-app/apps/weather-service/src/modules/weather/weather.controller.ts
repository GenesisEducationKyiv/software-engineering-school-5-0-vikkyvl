import { Controller, Get, Query } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
  patternsGRPC,
  WeatherRequestDto,
  WeatherResponseDto,
} from '../../../../../common/shared';
import { WeatherService } from './weather.service';
import { CityValidationPipe } from '../../common';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  async getWeatherHttp(
    @Query(new CityValidationPipe()) dto: WeatherRequestDto,
  ): Promise<WeatherResponseDto> {
    return await this.weatherService.getWeatherFromAPI(dto.city);
  }

  @GrpcMethod(patternsGRPC.WEATHER.SERVICE, patternsGRPC.WEATHER.METHOD)
  async getWeatherGrpc(
    @Payload(new CityValidationPipe()) dto: WeatherRequestDto,
  ): Promise<WeatherResponseDto> {
    return await this.weatherService.getWeatherFromAPI(dto.city);
  }
}
