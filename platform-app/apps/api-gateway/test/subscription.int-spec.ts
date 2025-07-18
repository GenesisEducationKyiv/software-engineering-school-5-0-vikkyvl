import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  setupTestContainers,
  TestContainers,
  Response,
  DEFAULT_TEST_TIMEOUT,
  createApiGatewayApp,
  createSubscriptionServiceApp,
} from './utils';
import { SubscriptionRepositoryInterface } from '../../subscription-service/src/modules/subscription/infrastructure/repository/interfaces/subscription.repository.interface';
import { SubscriptionModule as ApiGatewayModule } from '../src/modules/subscription/subscription.module';
import { ClientProxy, Transport } from '@nestjs/microservices';
import { Server } from 'http';
import { SubscriptionBuilder } from './mocks/subscription.builder';
import { subscriptionErrors } from '../../subscription-service/src/common';
import { EmailSenderService } from '../../subscription-service/src/modules/subscription/infrastructure/external/mail/email/email-sender.service';
import { delay, of } from 'rxjs';
import { messages } from '../../subscription-service/src/common';
import { errorMessages } from '../src/common';

describe('Subscription Endpoints', () => {
  let userFormWithWrongEmail: ReturnType<
    typeof SubscriptionBuilder.userFormWithWrongEmail
  >;

  let containers: TestContainers;

  const transport = Transport.RMQ;

  let apiGatewayApp: INestApplication;
  let subscriptionServiceApp: INestApplication;
  let clientProxy: ClientProxy;
  let subscriptionRepository: SubscriptionRepositoryInterface;
  let emailSenderService: EmailSenderService;

  jest.setTimeout(DEFAULT_TEST_TIMEOUT);

  beforeAll(async () => {
    userFormWithWrongEmail = SubscriptionBuilder.userFormWithWrongEmail();

    containers = await setupTestContainers();

    apiGatewayApp = await createApiGatewayApp(
      containers,
      'SUBSCRIPTION_SERVICE',
      'subscription-service',
      ApiGatewayModule,
      transport,
    );
    subscriptionServiceApp = await createSubscriptionServiceApp(containers);

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
    await containers.redis.container.stop();
    await containers.mailhog.container.stop();
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
      jest.restoreAllMocks();
    });

    it('should subscribe a user', async () => {
      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .post('/api/subscribe')
        .send(userForm);

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

      expect(response.status).toBe(
        subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED.status,
      );
      expect(response.body.message).toBe(
        subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED.message,
      );
    });

    it('should return 500 if email sending fails', async () => {
      jest
        .spyOn(emailSenderService, 'sendSubscriptionEmail')
        .mockImplementation((email: string, token: string) => {
          if (email === userFormWithWrongEmail.email && token) {
            return Promise.resolve({ isDelivered: false });
          }

          return Promise.resolve({ isDelivered: true });
        });

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      )
        .post('/api/subscribe')
        .send(userFormWithWrongEmail);

      expect(response.status).toBe(
        subscriptionErrors.EMAIL_SENDING_FAILED.status,
      );
      expect(response.body.message).toBe(
        subscriptionErrors.EMAIL_SENDING_FAILED.message,
      );
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
      jest
        .spyOn(clientProxy, 'send')
        .mockReturnValue(
          of(invalidToken).pipe(delay(DEFAULT_TEST_TIMEOUT + 1000)),
        );

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

    it('should return 500 if the unsubscription fails ', async () => {
      jest
        .spyOn(clientProxy, 'send')
        .mockReturnValue(
          of(tokenRecord).pipe(delay(DEFAULT_TEST_TIMEOUT + 1000)),
        );

      const response: Response = await request(
        apiGatewayApp.getHttpServer() as Server,
      ).get(`/api/unsubscribe/${tokenRecord}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(errorMessages.UNSUBSCRIPTION.FAILED);
    });
  });
});
