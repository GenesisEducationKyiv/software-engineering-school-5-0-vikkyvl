import { Module } from '@nestjs/common';
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
import { WeatherHttpController } from './weather.http.controller';
import { WeatherGrpcController } from './weather.grpc.controller';
import { ObservabilityModule } from '../observability/observability.module';
import { MetricsService } from '../observability/metrics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Weather]), ObservabilityModule],
  controllers: [WeatherGrpcController, WeatherHttpController],
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
      inject: [
        WeatherApiClientService,
        RedisService,
        weatherTokens.METRICS_SERVICE,
      ],
      useFactory: (
        weatherService: WeatherApiClientService,
        redisService: RedisService,
        observabilityService: MetricsService,
      ) => {
        return new WeatherServiceProxy(
          weatherService,
          redisService,
          observabilityService,
        );
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
