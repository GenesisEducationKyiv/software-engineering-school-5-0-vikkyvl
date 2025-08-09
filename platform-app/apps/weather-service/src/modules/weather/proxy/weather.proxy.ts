import { cachePrefixKey } from '../../../common';
import { WeatherApiClientServiceInterface } from '../infrastructure/external/weather-api-client.service';
import { WeatherFetchResult } from '../infrastructure/external/dto';
import { WeatherGeneralResponseDto } from '../infrastructure/external/dto';
import { Logger } from '@nestjs/common';
import { MetricsService } from '../../observability/metrics.service';

export interface CacheServiceInterface {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export class WeatherServiceProxy implements WeatherApiClientServiceInterface {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly weatherApiClient: WeatherApiClientServiceInterface,
    private readonly cacheService: CacheServiceInterface,
    private readonly metricsService: MetricsService,
  ) {}

  async fetchWeather(city: string): Promise<WeatherFetchResult> {
    let message: string;
    const prefix = cachePrefixKey.WEATHER;
    const cacheKey = `${prefix}${city}`;

    const isCached = await this.cacheService.get(cacheKey);

    if (isCached) {
      message = `CACHE HIT: "${city}" found in cache`;
      this.logger.log(message);

      this.metricsService.incrementCacheHitCounter();

      return {
        response: JSON.parse(isCached) as WeatherGeneralResponseDto,
        isRecordInCache: true,
      };
    }

    message = `CACHE MISS: "${city}" not found in cache, adding to cache`;
    this.logger.log(message);

    const weatherData = await this.weatherApiClient.fetchWeather(city);

    await this.cacheService.set(cacheKey, JSON.stringify(weatherData.response));

    this.metricsService.incrementCacheMissCounter();

    return {
      response: weatherData.response,
      isRecordInCache: false,
    };
  }
}
