import { WeatherServiceInterface } from '../interface';
import { WeatherDto } from '../../../../../../common/shared';
import { Logger } from '@nestjs/common';
import { prefixKey } from '../constants';

export interface RedisServiceInterface {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export class WeatherServiceProxy implements WeatherServiceInterface {
  private readonly logger = new Logger(WeatherServiceProxy.name);

  constructor(
    private readonly weatherService: WeatherServiceInterface,
    private readonly redisService: RedisServiceInterface,
  ) {}

  async getWeatherFromAPI(city: string): Promise<WeatherDto> {
    city = city.toLowerCase();

    let message: string;
    const prefix = prefixKey.WEATHER;
    const cacheKey = `${prefix}${city}`;

    const isCached = await this.redisService.get(cacheKey);

    if (isCached) {
      message = `"${city}" found in cache`;
      this.logger.log(message);

      return JSON.parse(isCached) as WeatherDto;
    }

    message = `"${city}" not found in cache, adding to cache`;
    this.logger.log(message);

    const weatherData = await this.weatherService.getWeatherFromAPI(city);

    await this.redisService.set(cacheKey, JSON.stringify(weatherData));

    return weatherData;
  }
}
