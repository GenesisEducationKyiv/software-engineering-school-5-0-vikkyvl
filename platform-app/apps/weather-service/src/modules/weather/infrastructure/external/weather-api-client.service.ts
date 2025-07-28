import { Inject, Injectable } from '@nestjs/common';
import { WeatherApiDataHandlerInterface } from './weather-api-data-handler';
import { weatherTokens } from '../../../../common';
import { WeatherFetchResult } from './dto';

export interface WeatherApiClientServiceInterface {
  fetchWeather(city: string): Promise<WeatherFetchResult>;
}

@Injectable()
export class WeatherApiClientService
  implements WeatherApiClientServiceInterface
{
  constructor(
    @Inject(weatherTokens.WEATHER_API_HANDLER)
    private handlers: WeatherApiDataHandlerInterface,
  ) {}

  async fetchWeather(city: string): Promise<WeatherFetchResult> {
    return {
      response: await this.handlers.handleRequest(city),
    };
  }
}
