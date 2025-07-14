import { WeatherApiConfigInterface } from './interface/weather-api-config.interface';

class WeatherApiConfigService implements WeatherApiConfigInterface {
  constructor() {}

  public getUrl(): string {
    return process.env.WEATHER_API_URL || '';
  }

  public getKey(): string {
    return process.env.WEATHER_API_KEY || '';
  }
}

export const weatherApiConfigService = new WeatherApiConfigService();
