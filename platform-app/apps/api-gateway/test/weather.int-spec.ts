import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
// import { ClientProxy } from '@nestjs/microservices';
import { WeatherBuilder } from './mocks/weather.builder';
import { of } from 'rxjs';
import { Server } from 'http';

describe('Weather Endpoints', () => {
  let app: INestApplication;
  // let mockClientProxy: ClientProxy;

  let weatherResponse: ReturnType<typeof WeatherBuilder.totalResult>;

  beforeAll(async () => {
    weatherResponse = WeatherBuilder.totalResult();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('WEATHER_SERVICE')
      .useValue({
        send: jest.fn().mockReturnValue(of(weatherResponse)),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // mockClientProxy = moduleFixture.get<ClientProxy>('WEATHER_SERVICE');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/weather/:city', () => {
    let city: ReturnType<typeof WeatherBuilder.getCity>;

    beforeEach(() => {
      city = WeatherBuilder.getCity();
    });

    it('/api/weather?city=Kyiv', async () => {
      return request(app.getHttpServer() as Server)
        .get('/api/weather')
        .query({ city: city })
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(weatherResponse);
        });
    });
  });
});
