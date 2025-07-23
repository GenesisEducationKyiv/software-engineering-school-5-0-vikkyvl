import { ClientGrpcProxy, Transport } from '@nestjs/microservices';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  setupTestContainers,
  TestContainers,
  Response,
  DEFAULT_TEST_TIMEOUT,
  createApiGatewayApp,
  createWeatherServiceApp,
} from './utils';
import { WeatherBuilder } from './mocks/weather.builder';
import { Server } from 'http';
import { WeatherModule as ApiGatewayModule } from '../src/modules/weather/weather.module';
import { WeatherApiClientServiceInterface } from '../../weather-service/src/modules/weather/infrastructure/external/weather-api-client.service';
import { weatherErrors } from '../../weather-service/src/common';
import { redisConfig } from '../../weather-service/src/modules/weather/infrastructure/cache/config/config';
import { errorMessages } from '../src/common';
import { delay, of } from 'rxjs';

describe('Weather Endpoints', () => {
  let containers: TestContainers;

  const transport = Transport.GRPC;

  let apiGatewayApp: INestApplication;
  let weatherServiceApp: INestApplication;
  let clientGrpc: ClientGrpcProxy;
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

  jest.setTimeout(DEFAULT_TEST_TIMEOUT);

  beforeAll(async () => {
    city = WeatherBuilder.getCity();
    invalidCity = WeatherBuilder.getInvalidCity();
    invalidCityWithNumber = WeatherBuilder.getInvalidCityWithNumber();
    delayCity = WeatherBuilder.getDelayCity();

    weatherGeneralResponse = WeatherBuilder.weatherGeneralResponse();

    containers = await setupTestContainers();

    apiGatewayApp = await createApiGatewayApp(
      containers,
      'WEATHER_SERVICE',
      'weather-service',
      ApiGatewayModule,
      transport,
    );

    redisConfig.host = containers.redis.host;
    redisConfig.port = containers.redis.port;

    weatherServiceApp = await createWeatherServiceApp(containers);

    clientGrpc = apiGatewayApp.get('WEATHER_SERVICE');
    weatherApiClient = weatherServiceApp.get('WeatherServiceProxy');
  });

  afterAll(async () => {
    await apiGatewayApp.close();
    await weatherServiceApp.close();
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
      expect(response.status).toBe(errorMessages.INTERNAL_SERVER_ERROR.status);
      expect(response.body.message).toEqual(errorMessages.WEATHER.FAILED);
    });
  });
});
