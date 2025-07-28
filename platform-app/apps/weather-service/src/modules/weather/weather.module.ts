import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from '../../entities/weather.entity';
import { WeatherRepository } from './infrastructure/repository/weather.repository';
import { WeatherApiClientService } from './infrastructure/external/weather-api-client.service';
import { WeatherServiceProxy } from './proxy/weather.proxy';
import { WeatherApiHandler } from './infrastructure/external/providers';
import { OpenWeatherMapHandler } from './infrastructure/external/providers';
import { WeatherStackHandler } from './infrastructure/external/providers';
import { RedisService } from './infrastructure/cache/redis.service';
import { redisClientFactory } from './infrastructure/cache/redis.client.factory';
import { weatherTokens } from '../../common';

@Module({
  imports: [TypeOrmModule.forFeature([Weather])],
  controllers: [WeatherController],
  providers: [
    WeatherApiClientService,
    WeatherService,
    RedisService,
    redisClientFactory,
    {
      provide: weatherTokens.WEATHER_REPOSITORY_INTERFACE,
      useClass: WeatherRepository,
    },
    {
      provide: weatherTokens.WEATHER_API_CLIENT_SERVICE_INTERFACE,
      useClass: WeatherApiClientService,
    },
    {
      provide: weatherTokens.WEATHER_SERVICE_PROXY,
      inject: [WeatherApiClientService, RedisService],
      useFactory: (
        weatherService: WeatherApiClientService,
        redisService: RedisService,
      ) => {
        return new WeatherServiceProxy(weatherService, redisService);
      },
    },
    {
      provide: weatherTokens.WEATHER_API_HANDLER,
      useFactory: () => {
        const weatherApiHandler = new WeatherApiHandler();
        const openWeatherMapHandler = new OpenWeatherMapHandler();
        const weatherStackHandler = new WeatherStackHandler();

        weatherApiHandler
          .setNextHandler(openWeatherMapHandler)
          .setNextHandler(weatherStackHandler);

        return weatherApiHandler;
      },
    },
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
