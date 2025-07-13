import { Module } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { apiConfigService } from '../../../../../common/config';
import { ErrorHandlerService } from '../../shared';
import { serviceTokens, sharedTokens } from '../../common';
import { join } from 'path';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherService,
    {
      provide: sharedTokens.ERROR_HANDLER_INTERFACE,
      useClass: ErrorHandlerService,
    },
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
