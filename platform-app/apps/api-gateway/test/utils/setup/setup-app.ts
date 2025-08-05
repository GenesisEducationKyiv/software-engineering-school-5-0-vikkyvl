import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TestContainers } from './setup-containers';
import { INestApplication, Type, ValidationPipe } from '@nestjs/common';
import { SubscriptionModule as SubscriptionModule } from '../../../../subscription-service/src/modules/subscription/subscription.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configPostgres } from '../configs/config-postgres';
import { Subscription } from '../../../../subscription-service/src/entities/subscription.entity';
import { ErrorHandlerFilter as SubscriptionServiceFilter } from '../../../../subscription-service/src/common';
import { WeatherModule } from '../../../../weather-service/src/modules/weather/weather.module';
import { Weather } from '../../../../weather-service/src/entities/weather.entity';
import {
  CityNotFound,
  GrpcErrorHandlerFilter as WeatherServiceFilter,
} from '../../../../weather-service/src/common';
import { WeatherBuilder } from '../../mocks/weather.builder';
import { join } from 'path';
import { configGrpc } from '../configs/config-grpc';
import { configMail } from '../mailhog/config-mail';
import { mailConfigService } from '../../../../../common/config';
import { NotificationModule } from '../../../../subscription-service/src/modules/notification/notification.module';

export async function createApiGatewayApp(
  containers: TestContainers,
  token: string,
  queue: string,
  module: Type<any>,
  transport: Transport,
): Promise<INestApplication> {
  jest.mock('@willsoto/nestjs-prometheus', () => ({
    PrometheusModule: {
      register: jest.fn(() => ({
        forRoot: jest.fn(),
        forRootAsync: jest.fn(),
      })),
    },
  }));

  const apiGatewayModule: TestingModule = await Test.createTestingModule({
    imports: [module],
  })
    .overrideProvider(token)
    .useValue(
      ClientProxyFactory.create(
        transport === Transport.RMQ
          ? {
              transport: Transport.RMQ,
              options: {
                urls: [containers.rabbit.url],
                queue,
                queueOptions: { durable: false },
              },
            }
          : {
              transport: Transport.GRPC,
              options: {
                url: configGrpc.URL,
                package: configGrpc.PACKAGE,
                protoPath: join(process.cwd(), configGrpc.PROTO_PATH),
              },
            },
      ),
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

  jest.mock('@willsoto/nestjs-prometheus', () => ({
    PrometheusModule: {
      register: jest.fn(() => ({
        forRoot: jest.fn(),
        forRootAsync: jest.fn(),
      })),
    },
  }));

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
      NotificationModule,
    ],
  })
    .overrideProvider('NotificationEventService')
    .useValue(
      ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [containers.rabbit.url],
          queue: 'notification-service',
          queueOptions: { durable: false },
        },
      }),
    )
    .compile();

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

  subscriptionServiceApp.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [containers.rabbit.url],
        queue: 'notification-service',
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
  const weatherGeneralResponse = WeatherBuilder.weatherGeneralResponse();

  jest.mock('@willsoto/nestjs-prometheus', () => ({
    PrometheusModule: {
      register: jest.fn(() => ({
        forRoot: jest.fn(),
        forRootAsync: jest.fn(),
      })),
    },
  }));

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
      transport: Transport.GRPC,
      options: {
        url: configGrpc.URL,
        package: configGrpc.PACKAGE,
        protoPath: join(process.cwd(), configGrpc.PROTO_PATH),
      },
    },
    { inheritAppConfig: true },
  );

  await weatherServiceApp.startAllMicroservices();
  await weatherServiceApp.init();

  return weatherServiceApp;
}
