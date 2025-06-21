import { WeatherApiConfigInterface } from './interface/weather-api-config.interface';

class WeatherStackConfigService implements WeatherApiConfigInterface {
  constructor() {}

  public getUrl(): string {
    return process.env.WEATHER_STACK_URL || '';
  }

  public getKey(): string {
    return process.env.WEATHER_STACK_KEY || '';
  }
}

export const weatherStackConfigService = new WeatherStackConfigService();
