import { Injectable } from '@nestjs/common';
import { WeatherApiHandler } from './weather-api-handler';
import { OpenWeatherMapHandler } from './open-weather-map-handler';
import { WeatherStackHandler } from './weather-stack-handler';
import { WeatherApiDataHandlerInterface } from './weather-api-data-handler';
import { WeatherGeneralResponseDto } from './dto';

export interface WeatherApiClientServiceInterface {
  fetchWeather(city: string): Promise<WeatherGeneralResponseDto>;
}

@Injectable()
export class WeatherApiClientService
  implements WeatherApiClientServiceInterface
{
  private handlers: WeatherApiDataHandlerInterface;

  constructor() {
    const weatherApiHandler = new WeatherApiHandler();
    const openWeatherMapHandler = new OpenWeatherMapHandler();
    const weatherStackHandler = new WeatherStackHandler();

    weatherApiHandler
      .setNextHandler(openWeatherMapHandler)
      .setNextHandler(weatherStackHandler);

    this.handlers = weatherApiHandler;
  }

  async fetchWeather(city: string): Promise<WeatherGeneralResponseDto> {
    return await this.handlers.handleRequest(city);
  }
}
