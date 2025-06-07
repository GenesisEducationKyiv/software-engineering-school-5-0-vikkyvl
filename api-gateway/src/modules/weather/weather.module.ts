import { Module } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherService,
    {
      provide: 'WEATHER_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.BROKER_URL],
            queue: 'weather-service',
            queueOptions: { durable: false },
          },
        } as ClientOptions),
    },
  ],
})
export class WeatherModule {}
