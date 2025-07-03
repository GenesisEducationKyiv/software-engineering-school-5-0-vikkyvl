import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from '../../entities/weather.entity';
import { WeatherRepository } from '../repository/weather.repository';
import { WeatherApiClientService } from '../external/weather-api-client.service';
import { WeatherServiceProxy } from './proxy/weather.proxy';
import { WeatherApiHandler } from '../external/providers';
import { OpenWeatherMapHandler } from '../external/providers';
import { WeatherStackHandler } from '../external/providers';
import { RedisService } from '../cache/redis.service';
import { redisClientFactory } from '../cache/redis.client.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Weather])],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    RedisService,
    redisClientFactory,
    {
      provide: 'WeatherRepositoryInterface',
      useClass: WeatherRepository,
    },
    {
      provide: 'WeatherApiClientServiceInterface',
      useClass: WeatherApiClientService,
    },
    {
      provide: 'WeatherServiceInterface',
      inject: [WeatherService, RedisService],
      useFactory: (
        weatherService: WeatherService,
        redisService: RedisService,
      ) => {
        return new WeatherServiceProxy(weatherService, redisService);
      },
    },
    {
      provide: 'WeatherApiHandler',
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
