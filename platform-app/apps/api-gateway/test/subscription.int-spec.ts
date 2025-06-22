import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { setupTestContainers, TestContainers } from './utils/setup-containers';
import { SubscriptionModule as ApiGatewayModule } from '../src/modules/subscription/subscription.module';
import { SubscriptionModule as SubscriptionModule } from '../../subscription-service/src/modules/subscription/subscription.module';
import { SubscriptionRepositoryInterface } from '../../subscription-service/src/modules/repository/subscription.repository.interface';
import {
  ClientOptions,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Subscription } from '../../subscription-service/src/entities/subscription.entity';
import { Server } from 'http';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionBuilder } from './mocks/subscription.builder';
import { subscriptionErrors } from '../../subscription-service/src/modules/errors';
import { configPostgres } from './utils/config-postgres';
import { Response } from './utils/response.dto';
import { EmailSenderService } from '../../subscription-service/src/modules/external/mail/email/email-sender.service';

describe('Subscription Endpoints', () => {
  let containers: TestContainers;

  let apiGatewayApp: INestApplication;
  let subscriptionServiceApp: INestApplication;
  let clientProxy: ClientProxy;
  let subscriptionRepository: SubscriptionRepositoryInterface;

  const links = SubscriptionBuilder.links();

  jest.setTimeout(90000);

  beforeAll(async () => {
    containers = await setupTestContainers();

    const apiGatewayModule: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule],
    })
      .overrideProvider('SUBSCRIPTION_SERVICE')
      .useValue(
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [containers.rabbit.url],
            queue: 'subscription-service',
            queueOptions: { durable: false },
          },
        } as ClientOptions),
      )
      .compile();

    apiGatewayApp = apiGatewayModule.createNestApplication();
    apiGatewayApp.setGlobalPrefix('api');
    await apiGatewayApp.init();

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
    })
      .overrideProvider(EmailSenderService)
      .useValue({
        sendSubscriptionEmail: jest
          .fn()
          .mockResolvedValue({ isDelivered: true }),
      })
      .overrideProvider('LinkServiceInterface')
      .useValue({
        getLinks: jest.fn().mockReturnValue(links),
      })
      .compile();

    subscriptionServiceApp = subscriptionServiceModule.createNestApplication();
    subscriptionServiceApp.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [containers.rabbit.url],
        queue: 'subscription-service',
        queueOptions: { durable: false },
      },
    });

    await subscriptionServiceApp.startAllMicroservices();
    await subscriptionServiceApp.init();

    clientProxy = apiGatewayApp.get('SUBSCRIPTION_SERVICE');
    subscriptionRepository = subscriptionServiceApp.get(
      'SubscriptionRepositoryInterface',
    );
  });

  afterAll(async () => {
    await apiGatewayApp.close();
    await subscriptionServiceApp.close();
    await clientProxy.close();
    await containers.rabbit.container.stop();
    await containers.postgres.container.stop();
  });

  describe('POST /api/subscribe', () => {
    let userForm: ReturnType<typeof SubscriptionBuilder.userForm>;

    beforeEach(() => {
      userForm = SubscriptionBuilder.userForm();
    });

    it('should subscribe a user', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .post('/api/subscribe')
        .send(userForm);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Confirmation email sent.',
      });
    });

    it('should return 409 if user exists', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .post('/api/subscribe')
        .send(userForm);

      expect(response.status).toBe(
        subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED.status,
      );
      expect(response.body.message).toBe(
        subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED.message,
      );
    });
  });

  describe('GET /api/confirm/{token}', () => {
    let userForm: ReturnType<typeof SubscriptionBuilder.userForm>;
    let invalidToken: ReturnType<typeof SubscriptionBuilder.invalidToken>;
    let tokenRecord: string | undefined;
    let confirmedRecord: boolean | undefined;

    async function getSubscriptionTokenAndConfirmed(email: string) {
      const record = await subscriptionRepository.findByEmail(email);

      return {
        token: record?.token,
        confirmed: record?.confirmed,
      };
    }

    beforeEach(async () => {
      userForm = SubscriptionBuilder.userForm();
      invalidToken = SubscriptionBuilder.invalidToken();

      ({ token: tokenRecord, confirmed: confirmedRecord } =
        await getSubscriptionTokenAndConfirmed(userForm.email));
    });

    it('should confirm a subscription', async () => {
      expect(tokenRecord).toBeDefined();

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/confirm/${tokenRecord}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Subscription confirmed successfully');
    });

    it('should return a message if the subscription is already confirmed', async () => {
      expect(confirmedRecord).toBeDefined();

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/confirm/${tokenRecord}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Subscription already confirmed');
    });

    it('should return 404 for a completely invalid confirmation token', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/confirm/${invalidToken}`);

      expect(response.status).toBe(
        subscriptionErrors.INVALID_CONFIRMATION_TOKEN.status,
      );
      expect(response.body.message).toBe(
        subscriptionErrors.INVALID_CONFIRMATION_TOKEN.message,
      );
    });
  });

  describe('GET /api/unsubscribe/{token}', () => {
    let userForm: ReturnType<typeof SubscriptionBuilder.userForm>;
    let invalidToken: ReturnType<typeof SubscriptionBuilder.invalidToken>;
    let tokenRecord: string | undefined;

    async function getSubscriptionToken(email: string) {
      const record = await subscriptionRepository.findByEmail(email);

      return {
        token: record?.token,
      };
    }

    beforeEach(async () => {
      userForm = SubscriptionBuilder.userForm();
      invalidToken = SubscriptionBuilder.invalidToken();

      ({ token: tokenRecord } = await getSubscriptionToken(userForm.email));
    });

    it('should unsubscribe a user', async () => {
      expect(tokenRecord).toBeDefined();

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/unsubscribe/${tokenRecord}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Unsubscribed successfully');
    });

    it('should return 404 if the unsubscription token is no longer valid', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/unsubscribe/${tokenRecord}`);

      expect(response.status).toBe(
        subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN.status,
      );
      expect(response.body.message).toBe(
        subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN.message,
      );
    });

    it('should return 404 for a completely invalid unsubscription token', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/unsubscribe/${invalidToken}`);

      expect(response.status).toBe(
        subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN.status,
      );
      expect(response.body.message).toBe(
        subscriptionErrors.INVALID_UNSUBSCRIPTION_TOKEN.message,
      );
    });
  });
});
