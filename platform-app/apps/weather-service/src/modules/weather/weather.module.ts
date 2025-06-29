import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from '../../entities/weather.entity';
import { WeatherRepository } from '../repository/weather.repository';
import { WeatherApiClientService } from '../external/weather-api-client.service';
import { RedisService } from '../cache/redis.service';
import { WeatherServiceProxy } from './proxy/weather.proxy';

@Module({
  imports: [TypeOrmModule.forFeature([Weather])],
  controllers: [WeatherController],
  providers: [
    RedisService,
    WeatherService,
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
  ],
  exports: ['WeatherServiceInterface'],
})
export class WeatherModule {}
