import { Module } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { apiConfigService } from '../../../../../common/config';
import { join } from 'path';
import { serviceTokens } from '../../common';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherService,
    {
      provide: serviceTokens.WEATHER_SERVICE,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: apiConfigService.getGrpcUrl(),
            package: apiConfigService.getPackageName(),
            protoPath: join(
              process.cwd(),
              'common/proto/weather/weather.proto',
            ),
          },
        } as ClientOptions),
    },
  ],
})
export class WeatherModule {}
