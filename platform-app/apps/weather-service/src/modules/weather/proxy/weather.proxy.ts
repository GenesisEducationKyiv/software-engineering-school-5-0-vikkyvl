import { Logger } from '@nestjs/common';
import { cachePrefixKey } from '../constants';
import { WeatherApiClientServiceInterface } from '../../external/weather-api-client.service';
import { WeatherFetchResult } from '../../external/dto/weather-fetch-result.dto';
import { WeatherGeneralResponseDto } from '../../external/dto';

export interface CacheServiceInterface {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export class WeatherServiceProxy implements WeatherApiClientServiceInterface {
  private readonly logger = new Logger(WeatherServiceProxy.name);

  constructor(
    private readonly weatherApiClient: WeatherApiClientServiceInterface,
    private readonly cacheService: CacheServiceInterface,
  ) {}

  async fetchWeather(city: string): Promise<WeatherFetchResult> {
    let message: string;
    const prefix = cachePrefixKey.WEATHER;
    const cacheKey = `${prefix}${city}`;

    const isCached = await this.cacheService.get(cacheKey);

    if (isCached) {
      message = `"${city}" found in cache`;
      this.logger.log(message);

      return {
        response: JSON.parse(isCached) as WeatherGeneralResponseDto,
        isRecordInCache: true,
      };
    }

    message = `"${city}" not found in cache, adding to cache`;
    this.logger.log(message);

    const weatherData = await this.weatherApiClient.fetchWeather(city);

    await this.cacheService.set(cacheKey, JSON.stringify(weatherData.response));

    return {
      response: weatherData.response,
      isRecordInCache: false,
    };
  }
}
