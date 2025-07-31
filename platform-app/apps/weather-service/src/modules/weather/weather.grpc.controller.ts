import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
  patternsGRPC,
  WeatherRequestGrpcDto,
  WeatherResponseGrpcDto,
} from '../../../../../common/shared';
import { WeatherService } from './weather.service';
import { CityValidationPipe, GrpcErrorHandlerFilter } from '../../common';

@Controller()
@UseFilters(new GrpcErrorHandlerFilter())
export class WeatherGrpcController {
  constructor(private weatherService: WeatherService) {}

  @GrpcMethod(patternsGRPC.WEATHER.SERVICE, patternsGRPC.WEATHER.METHOD)
  async getWeatherGrpc(
    @Payload(new CityValidationPipe()) dto: WeatherRequestGrpcDto,
  ): Promise<WeatherResponseGrpcDto> {
    return await this.weatherService.getWeatherFromAPI(dto.city);
  }
}
