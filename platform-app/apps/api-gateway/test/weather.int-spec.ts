import {
  ClientOptions,
  ClientProxy,
  ClientProxyFactory,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { setupTestContainers, TestContainers } from './utils/setup-containers';
import { WeatherBuilder } from './mocks/weather.builder';
import { Server } from 'http';
import { WeatherModule as ApiGatewayModule } from '../src/modules/weather/weather.module';
import { WeatherModule as WeatherModule } from '../../weather-service/src/modules/weather/weather.module';
import { WeatherApiClientServiceInterface } from '../../weather-service/src/modules/external/weather-api-client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configPostgres } from './utils/config-postgres';
import { Weather } from '../../weather-service/src/entities/weather.entity';
import { Response } from './utils/response.dto';
import { weatherErrors } from '../../weather-service/src/common';
import { delay, of } from 'rxjs';
import { errorMessages } from '../src/common';
import { redisConfig } from '../../weather-service/src/modules/cache/config/config';

describe('Weather Endpoints', () => {
  let containers: TestContainers;

  let apiGatewayApp: INestApplication;
  let weatherServiceApp: INestApplication;
  let clientProxy: ClientProxy;
  let weatherApiClient: WeatherApiClientServiceInterface;

  let city: ReturnType<typeof WeatherBuilder.getCity>;
  let invalidCity: ReturnType<typeof WeatherBuilder.getInvalidCity>;
  let invalidCityWithNumber: ReturnType<
    typeof WeatherBuilder.getInvalidCityWithNumber
  >;
  let delayCity: ReturnType<typeof WeatherBuilder.getDelayCity>;

  let weatherGeneralResponse: ReturnType<
    typeof WeatherBuilder.weatherGeneralResponse
  >;

  jest.setTimeout(90000);

  beforeAll(async () => {
    city = WeatherBuilder.getCity();
    invalidCity = WeatherBuilder.getInvalidCity();
    invalidCityWithNumber = WeatherBuilder.getInvalidCityWithNumber();
    delayCity = WeatherBuilder.getDelayCity();

    weatherGeneralResponse = WeatherBuilder.weatherGeneralResponse();

    containers = await setupTestContainers();

    const apiGatewayModule: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule],
    })
      .overrideProvider('WEATHER_SERVICE')
      .useValue(
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [containers.rabbit.url],
            queue: 'weather-service',
            queueOptions: { durable: false },
          },
        } as ClientOptions),
      )
      .compile();

    apiGatewayApp = apiGatewayModule.createNestApplication();
    apiGatewayApp.setGlobalPrefix('api');
    await apiGatewayApp.init();

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
        TypeOrmModule.forFeature([Weather]),
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

          if (city === delayCity) {
            return of(weatherGeneralResponse).pipe(delay(4000));
          }

          return Promise.resolve({
            response: weatherGeneralResponse,
            isRecordInCache: false,
          });
        }),
      })
      .compile();

    weatherServiceApp = weatherServiceModule.createNestApplication();
    weatherServiceApp.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [containers.rabbit.url],
        queue: 'weather-service',
        queueOptions: { durable: false },
      },
    });

    await weatherServiceApp.startAllMicroservices();
    await weatherServiceApp.init();

    clientProxy = apiGatewayApp.get('WEATHER_SERVICE');
    weatherApiClient = weatherServiceApp.get('WeatherServiceProxy');
  });

  afterAll(async () => {
    await apiGatewayApp.close();
    await weatherServiceApp.close();
    await clientProxy.close();
    await containers.rabbit.container.stop();
    await containers.postgres.container.stop();
    await containers.redis.container.stop();
  });

  describe('GET /api/weather/:city', () => {
    it('/api/weather?city=city', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .get('/api/weather')
        .query({ city: city });

      expect(weatherApiClient.fetchWeather).toHaveBeenCalledWith(city);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(weatherGeneralResponse);
    });

    it('/api/weather?city=invalidCity', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .get('/api/weather')
        .query({ city: invalidCity });

      expect(weatherApiClient.fetchWeather).toHaveBeenCalledWith(invalidCity);
      expect(response.status).toBe(weatherErrors.CITY_NOT_FOUND.status);
      expect(response.body.message).toEqual(
        weatherErrors.CITY_NOT_FOUND.message,
      );
    });

    it('/api/weather?city=invalidCityWithNumber', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .get('/api/weather')
        .query({ city: invalidCityWithNumber });

      expect(response.status).toBe(weatherErrors.INVALID_REQUEST.status);
      expect(response.body.message).toEqual(
        weatherErrors.INVALID_REQUEST.message,
      );
    });

    it('/api/weather?city=delayCity', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .get('/api/weather')
        .query({ city: delayCity });

      expect(weatherApiClient.fetchWeather).toHaveBeenCalledWith(delayCity);
      expect(response.status).toBe(500);
      expect(response.body.message).toEqual(errorMessages.WEATHER.FAILED);
    });
  });
});
