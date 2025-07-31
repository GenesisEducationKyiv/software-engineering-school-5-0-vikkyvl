import { Test, TestingModule } from '@nestjs/testing';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { TestContainers } from './setup-containers';
import { INestApplication, Type, ValidationPipe } from '@nestjs/common';
import { SubscriptionModule as SubscriptionModule } from '../../../subscription-service/src/modules/subscription/subscription.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configPostgres } from './config-postgres';
import { Subscription } from '../../../subscription-service/src/entities/subscription.entity';
import { ErrorHandlerFilter as SubscriptionServiceFilter } from '../../../subscription-service/src/common';
import { WeatherModule } from '../../../weather-service/src/modules/weather/weather.module';
import { Weather } from '../../../weather-service/src/entities/weather.entity';
import {
  CityNotFound,
  ErrorHandlerFilter as WeatherServiceFilter,
} from '../../../weather-service/src/common';
import { delay, of } from 'rxjs';
import { WeatherBuilder } from '../mocks/weather.builder';
import { mailConfigService } from '../../../../common/config';
import { configMail } from './config-mail';

export async function createApiGatewayApp(
  containers: TestContainers,
  token: string,
  queue: string,
  module: Type<any>,
): Promise<INestApplication> {
  const apiGatewayModule: TestingModule = await Test.createTestingModule({
    imports: [module],
  })
    .overrideProvider(token)
    .useValue(
      ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [containers.rabbit.url],
          queue: queue,
          queueOptions: { durable: false },
        },
      } as ClientOptions),
    )
    .compile();

  const apiGatewayApp = apiGatewayModule.createNestApplication();
  apiGatewayApp.useGlobalPipes(new ValidationPipe());
  apiGatewayApp.setGlobalPrefix('api');
  await apiGatewayApp.init();

  return apiGatewayApp;
}

export async function createSubscriptionServiceApp(
  containers: TestContainers,
): Promise<INestApplication> {
  mailConfigService.setEmailHost(containers.mailhog.host);
  mailConfigService.setEmailPort(containers.mailhog.smtpPort);
  mailConfigService.setEmailSecure(false);
  mailConfigService.setEmailUser(configMail.TEST_USER);
  mailConfigService.setEmailPassword(configMail.TEST_PASSWORD);

  const subscriptionServiceModule = await Test.createTestingModule({
    imports: [
      SubscriptionModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: containers.postgres.host,
        port: Number(containers.postgres.port),
        username: configPostgres.TEST_USER,
        password: configPostgres.TEST_PASSWORD,
        database: configPostgres.TEST_DB,
        entities: [Subscription],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([Subscription]),
    ],
  }).compile();

  const subscriptionServiceApp =
    subscriptionServiceModule.createNestApplication();
  subscriptionServiceApp.useGlobalFilters(new SubscriptionServiceFilter());
  subscriptionServiceApp.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [containers.rabbit.url],
        queue: 'subscription-service',
        queueOptions: { durable: false },
      },
    },
    { inheritAppConfig: true },
  );

  await subscriptionServiceApp.startAllMicroservices();
  await subscriptionServiceApp.init();

  return subscriptionServiceApp;
}

export async function createWeatherServiceApp(
  containers: TestContainers,
): Promise<INestApplication> {
  const invalidCity = WeatherBuilder.getInvalidCity();
  const delayCity = WeatherBuilder.getDelayCity();
  const weatherGeneralResponse = WeatherBuilder.weatherGeneralResponse();

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
          return Promise.reject(new CityNotFound());
        }

        if (city === delayCity) {
          return of(weatherGeneralResponse).pipe(delay(7000));
        }

        return Promise.resolve({
          response: weatherGeneralResponse,
          isRecordInCache: false,
        });
      }),
    })
    .compile();

  const weatherServiceApp = weatherServiceModule.createNestApplication();
  weatherServiceApp.useGlobalFilters(new WeatherServiceFilter());
  weatherServiceApp.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [containers.rabbit.url],
        queue: 'weather-service',
        queueOptions: { durable: false },
      },
    },
    { inheritAppConfig: true },
  );

  await weatherServiceApp.startAllMicroservices();
  await weatherServiceApp.init();

  return weatherServiceApp;
}
