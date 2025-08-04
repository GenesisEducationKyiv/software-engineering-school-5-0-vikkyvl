import { Transport } from '@nestjs/microservices';
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
import { mapGrpcToHttp } from '../../../common/shared';
import { WeatherService } from '../src/modules/weather/weather.service';
import { throwError } from 'rxjs';
import { GrpcException } from '../src/common/exceptions/grpc-exception';

describe('Weather Endpoints', () => {
  let containers: TestContainers;

  const transport = Transport.GRPC;

  let apiGatewayApp: INestApplication;
  let weatherServiceApp: INestApplication;
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

  let clientGrpc: WeatherService;

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

    weatherApiClient = weatherServiceApp.get('WeatherServiceProxy');
    clientGrpc = apiGatewayApp.get(WeatherService);
  });

  afterAll(async () => {
    await apiGatewayApp.close();
    await weatherServiceApp.close();
    await containers.rabbit.container.stop();
    await containers.postgres.container.stop();
    await containers.redis.container.stop();
    await containers.mailhog.container.stop();
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
      expect(response.status).toBe(
        mapGrpcToHttp(weatherErrors.CITY_NOT_FOUND.code),
      );
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

      expect(response.status).toBe(
        mapGrpcToHttp(weatherErrors.INVALID_REQUEST.code),
      );
      expect(response.body.message).toEqual(
        weatherErrors.INVALID_REQUEST.message,
      );
    });

    it('/api/weather?city=delayCity', async () => {
      const error = {
        message:
          '14 UNAVAILABLE: No connection established. Last error: Error: connect ECONNREFUSED 127.0.0.1:5000',
        code: 14,
        details:
          'No connection established. Last error: Error: connect ECONNREFUSED 127.0.0.1:5000',
      };

      jest
        .spyOn(clientGrpc.service, 'getWeather')
        .mockReturnValue(throwError(() => new GrpcException(error)));

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .get('/api/weather')
        .query({ city: delayCity });

      expect(response.status).toBe(errorMessages.INTERNAL_SERVER_ERROR.status);
      expect(response.body.message).toEqual(errorMessages.WEATHER.FAILED);
    });
  });
});
