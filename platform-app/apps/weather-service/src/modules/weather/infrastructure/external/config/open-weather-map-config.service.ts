import { WeatherApiConfigInterface } from './interface/weather-api-config.interface';

class OpenWeatherMapConfigService implements WeatherApiConfigInterface {
  constructor() {}

  public getUrl(): string {
    return process.env.OPEN_WEATHER_MAP_URL || '';
  }

  public getKey(): string {
    return process.env.OPEN_WEATHER_MAP_KEY || '';
  }
}

export const openWeatherMapConfigService = new OpenWeatherMapConfigService();
