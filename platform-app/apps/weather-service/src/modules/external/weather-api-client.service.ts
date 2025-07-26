import { Inject, Injectable } from '@nestjs/common';
import { WeatherApiDataHandlerInterface } from './weather-api-data-handler';
import { WeatherGeneralResponseDto } from './dto';

export interface WeatherApiClientServiceInterface {
  fetchWeather(city: string): Promise<WeatherGeneralResponseDto>;
}

@Injectable()
export class WeatherApiClientService
  implements WeatherApiClientServiceInterface
{
  constructor(
    @Inject('WeatherApiHandler')
    private handlers: WeatherApiDataHandlerInterface,
  ) {}

  async fetchWeather(city: string): Promise<WeatherGeneralResponseDto> {
    return await this.handlers.handleRequest(city);
  }
}
