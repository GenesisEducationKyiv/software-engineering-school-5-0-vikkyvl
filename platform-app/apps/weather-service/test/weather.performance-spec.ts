import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Server } from 'http';
import {
  configGrpc,
  configPostgres,
  DEFAULT_TEST_TIMEOUT,
  setupTestContainers,
  TestContainers,
} from '../../api-gateway/test/utils';
import { WeatherModule } from '../src/modules/weather/weather.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from '../src/entities/weather.entity';
import { redisConfig } from '../src/modules/weather/infrastructure/cache/config/config';
import {
  ClientGrpc,
  ClientProxyFactory,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { WeatherServiceInterface } from '../../../common/proto/weather/weather';
import { firstValueFrom } from 'rxjs';
import { averageDuration } from './utils';
import { weatherErrors } from '../src/common';
import { WeatherServiceBuilder } from './mocks/weather.service.builder';

describe('Weather Service (performance)', () => {
  let containers: TestContainers;

  let app: INestApplication;
  let clientGrpc: ClientGrpc;
  let weatherService: WeatherServiceInterface;

  let city: ReturnType<typeof WeatherServiceBuilder.getCity>;
  let invalidCity: ReturnType<typeof WeatherServiceBuilder.getInvalidCity>;
  let weatherData: ReturnType<
    typeof WeatherServiceBuilder.weatherGeneralResponse
  >;

  jest.setTimeout(DEFAULT_TEST_TIMEOUT);

  beforeEach(async () => {
    containers = await setupTestContainers();

    city = WeatherServiceBuilder.getCity();
    invalidCity = WeatherServiceBuilder.getInvalidCity();
    weatherData = WeatherServiceBuilder.weatherGeneralResponse();

    redisConfig.host = containers.redis.host;
    redisConfig.port = containers.redis.port;

    const weatherServiceModule = await Test.createTestingModule({
      imports: [
        WeatherModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: containers.postgres.host,
          port: Number(containers.postgres.port),
          username: configPostgres.TEST_USER,
          password: configPostgres.TEST_PASSWORD,
          database: configPostgres.TEST_DB,
          entities: [Weather],
          synchronize: true,
        }),
      ],
    })
      .overrideProvider('WeatherServiceProxy')
      .useValue({
        fetchWeather: jest.fn().mockImplementation((city: string) => {
          if (city === invalidCity) {
            return Promise.reject(
              new RpcException(weatherErrors.CITY_NOT_FOUND),
            );
          }

          return Promise.resolve({
            response: weatherData,
            isRecordInCache: false,
          });
        }),
      })
      .compile();

    app = weatherServiceModule.createNestApplication();

    app.connectMicroservice(
      {
        transport: Transport.GRPC,
        options: {
          url: configGrpc.URL,
          package: configGrpc.PACKAGE,
          protoPath: join(process.cwd(), configGrpc.PROTO_PATH),
        },
      },
      { inheritAppConfig: true },
    );

    await app.startAllMicroservices();
    await app.init();

    clientGrpc = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: configGrpc.URL,
        package: configGrpc.PACKAGE,
        protoPath: join(process.cwd(), configGrpc.PROTO_PATH),
      },
    }) as ClientGrpc;

    weatherService =
      clientGrpc.getService<WeatherServiceInterface>('WeatherService');
  });

  afterEach(async () => {
    await app.close();
    await containers.postgres.container.stop();
    await containers.redis.container.stop();
  });

  describe('should measure average performance of weather service', () => {
    it('HTTP API', async () => {
      await averageDuration(
        () =>
          request(app.getHttpServer() as Server)
            .get('/weather')
            .query({ city: city }),
        'HTTP API',
      );
    });

    it('gRPC', async () => {
      await averageDuration(
        () => firstValueFrom(weatherService.getWeather({ city: city })),
        'gRPC',
      );
    });
  });
});
