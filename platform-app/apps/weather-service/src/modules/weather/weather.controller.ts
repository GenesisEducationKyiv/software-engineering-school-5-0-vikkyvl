import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import {
  patternsGRPC,
  WeatherRequestDto,
  WeatherResponseDto,
} from '../../../../../common/shared';
import { DomainException, IntervalError, InvalidRequest } from '../../common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @GrpcMethod(patternsGRPC.WEATHER.SERVICE, patternsGRPC.WEATHER.METHOD)
  async getWeather(dto: WeatherRequestDto): Promise<WeatherResponseDto> {
    const hasNonAlphabetChars = /[^\p{L}\s-]/u.test(dto.city);

    if (hasNonAlphabetChars) {
      throw new InvalidRequest();
    }

    try {
      return await this.weatherService.getWeatherFromAPI(dto.city);
    } catch (error: unknown) {
      if (error instanceof DomainException) {
        throw new RpcException({
          code: error.getCode(),
          status: error.getStatus(),
          message: error.getMessage(),
        });
      }

      throw new IntervalError();
    }
  }
}
