import { WeatherServiceInterface } from '../interface';
import { WeatherDto } from '../../../../../../common/shared';
import { Logger } from '@nestjs/common';
import { RedisService } from '../../cache/redis.service';

export class WeatherServiceProxy implements WeatherServiceInterface {
  private readonly logger = new Logger(WeatherServiceProxy.name);

  constructor(
    private readonly weatherService: WeatherServiceInterface,
    private readonly redisService: RedisService,
  ) {}

  async getWeatherFromAPI(city: string): Promise<WeatherDto> {
    let message: string;
    const prefix = 'weather:';
    const cacheKey = `${prefix}${city}`;
    const ttlInSeconds = 15 * 60;

    const isCached = await this.redisService.get(cacheKey);

    if (isCached) {
      message = `"${city}" found in cache`;
      this.logger.log(message);

      return JSON.parse(isCached) as WeatherDto;
    }

    message = `"${city}" not found in cache, adding to cache`;
    this.logger.log(message);

    const weatherData = await this.weatherService.getWeatherFromAPI(city);

    await this.redisService.set(
      cacheKey,
      JSON.stringify(weatherData),
      ttlInSeconds,
    );

    return weatherData;
  }
}
