import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { setupTestContainers, TestContainers } from './utils/setup-containers';
import { SubscriptionModule as ApiGatewayModule } from '../src/modules/subscription/subscription.module';
import { SubscriptionModule as SubscriptionModule } from '../../subscription-service/src/modules/subscription/subscription.module';
import { SubscriptionRepositoryInterface } from '../../subscription-service/src/modules/subscription/infrastructure/repository/interfaces/subscription.repository.interface';
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
import { subscriptionErrors } from '../../subscription-service/src/common';
import { configPostgres } from './utils/config-postgres';
import { Response } from './utils/response.dto';
import { EmailSenderService } from '../../subscription-service/src/modules/subscription/infrastructure/external/mail/email/email-sender.service';
import { throwError, TimeoutError } from 'rxjs';
import { messages } from '../../subscription-service/src/common';
import { errorMessages } from '../src/common';

describe('Subscription Endpoints', () => {
  let userFormWithWrongEmail: ReturnType<
    typeof SubscriptionBuilder.userFormWithWrongEmail
  >;

  let containers: TestContainers;

  let apiGatewayApp: INestApplication;
  let subscriptionServiceApp: INestApplication;
  let clientProxy: ClientProxy;
  let subscriptionRepository: SubscriptionRepositoryInterface;
  let emailSenderService: EmailSenderService;

  jest.setTimeout(90000);

  beforeAll(async () => {
    userFormWithWrongEmail = SubscriptionBuilder.userFormWithWrongEmail();

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
    apiGatewayApp.useGlobalPipes(new ValidationPipe());
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
          .mockImplementation((email: string, token: string) => {
            if (email === userFormWithWrongEmail.email && token) {
              return Promise.resolve({ isDelivered: false });
            }

            return Promise.resolve({ isDelivered: true });
          }),
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
    emailSenderService =
      subscriptionServiceApp.get<EmailSenderService>(EmailSenderService);
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
    let userFormWithInvalidEmail: ReturnType<
      typeof SubscriptionBuilder.userFormWithInvalidEmail
    >;
    let subscriptionEntity: ReturnType<
      typeof SubscriptionBuilder.subscriptionEntity
    >;

    beforeEach(() => {
      userForm = SubscriptionBuilder.userForm();
      userFormWithInvalidEmail = SubscriptionBuilder.userFormWithInvalidEmail();
      subscriptionEntity = SubscriptionBuilder.subscriptionEntity();
    });

    afterEach(async () => {
      await subscriptionRepository.deleteSubscription(subscriptionEntity);
    });

    it('should subscribe a user', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .post('/api/subscribe')
        .send(userForm);

      const record = await subscriptionRepository.findByEmail(userForm.email);
      expect(emailSenderService.sendSubscriptionEmail).toHaveBeenCalledWith(
        userForm.email,
        record!.token,
      );

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: messages.SUBSCRIPTION.EMAIL_SENT,
      });
    });

    it('should not subscribe a user', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .post('/api/subscribe')
        .send(userFormWithInvalidEmail);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email must be an email');
    });

    it('should return 409 if user exists', async () => {
      subscriptionRepository.createSubscription(subscriptionEntity);
      await subscriptionRepository.saveSubscription(subscriptionEntity);

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .post('/api/subscribe')
        .send(userForm);

      expect(emailSenderService.sendSubscriptionEmail).not.toHaveBeenCalledWith(
        2,
      );

      expect(response.status).toBe(
        subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED.status,
      );
      expect(response.body.message).toBe(
        subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED.message,
      );
    });

    it('should return 500 if email sending fails', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .post('/api/subscribe')
        .send(userFormWithWrongEmail);

      expect(response.status).toBe(
        subscriptionErrors.EMAIL_SENDING_FAILED.status,
      );
      expect(response.body.message).toBe(errorMessages.SUBSCRIPTION.FAILED);
    });
  });

  describe('GET /api/confirm/{token}', () => {
    let userForm: ReturnType<typeof SubscriptionBuilder.userForm>;
    let invalidToken: ReturnType<typeof SubscriptionBuilder.invalidToken>;
    let tokenRecord: string | undefined;
    let confirmedRecord: boolean | undefined;
    let subscriptionEntity: ReturnType<
      typeof SubscriptionBuilder.subscriptionEntity
    >;

    async function getSubscriptionTokenAndConfirmed(email: string) {
      const record = await subscriptionRepository.findByEmail(email);

      return {
        token: record?.token,
        confirmed: record?.confirmed,
      };
    }

    beforeEach(() => {
      userForm = SubscriptionBuilder.userForm();
      invalidToken = SubscriptionBuilder.invalidToken();
      subscriptionEntity = SubscriptionBuilder.subscriptionEntity();
    });

    afterEach(async () => {
      await subscriptionRepository.deleteSubscription(subscriptionEntity);
      jest.restoreAllMocks();
    });

    it('should confirm a subscription', async () => {
      subscriptionRepository.createSubscription(subscriptionEntity);
      await subscriptionRepository.saveSubscription(subscriptionEntity);

      ({ token: tokenRecord, confirmed: confirmedRecord } =
        await getSubscriptionTokenAndConfirmed(userForm.email));

      expect(tokenRecord).toBeDefined();

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/confirm/${tokenRecord}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(messages.CONFIRMATION.SUCCESS);
    });

    it('should return a message if the subscription is already confirmed', async () => {
      subscriptionEntity = SubscriptionBuilder.subscriptionEntity(true);

      subscriptionRepository.createSubscription(subscriptionEntity);
      await subscriptionRepository.saveSubscription(subscriptionEntity);

      ({ token: tokenRecord, confirmed: confirmedRecord } =
        await getSubscriptionTokenAndConfirmed(userForm.email));

      expect(confirmedRecord).toBeDefined();

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/confirm/${tokenRecord}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        messages.CONFIRMATION.ALREADY_CONFIRMED,
      );
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

    it('should return 500 if the confirmation fails', async () => {
      jest.spyOn(clientProxy, 'send').mockImplementation(() => {
        return throwError(() => new TimeoutError());
      });

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/confirm/${invalidToken}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessages.CONFIRMATION.FAILED);
    });
  });

  describe('GET /api/unsubscribe/{token}', () => {
    let userForm: ReturnType<typeof SubscriptionBuilder.userForm>;
    let invalidToken: ReturnType<typeof SubscriptionBuilder.invalidToken>;
    let tokenRecord: string | undefined;
    let subscriptionEntity: ReturnType<
      typeof SubscriptionBuilder.subscriptionEntity
    >;

    async function getSubscriptionToken(email: string) {
      const record = await subscriptionRepository.findByEmail(email);

      return {
        token: record?.token,
      };
    }

    beforeEach(() => {
      userForm = SubscriptionBuilder.userForm();
      invalidToken = SubscriptionBuilder.invalidToken();
      subscriptionEntity = SubscriptionBuilder.subscriptionEntity();
    });

    afterEach(async () => {
      await subscriptionRepository.deleteSubscription(subscriptionEntity);
      jest.restoreAllMocks();
    });

    it('should unsubscribe a user', async () => {
      subscriptionRepository.createSubscription(subscriptionEntity);
      await subscriptionRepository.saveSubscription(subscriptionEntity);

      ({ token: tokenRecord } = await getSubscriptionToken(userForm.email));

      expect(tokenRecord).toBeDefined();

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/unsubscribe/${tokenRecord}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(messages.UNSUBSCRIPTION.SUCCESS);
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

    it('should return 500 if the unsubscription fails', async () => {
      jest.spyOn(clientProxy, 'send').mockImplementation(() => {
        return throwError(() => new TimeoutError());
      });

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/unsubscribe/${tokenRecord}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessages.UNSUBSCRIPTION.FAILED);
    });
  });
});
