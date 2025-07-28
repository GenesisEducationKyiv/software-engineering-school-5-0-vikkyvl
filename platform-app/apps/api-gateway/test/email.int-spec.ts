import * as qp from 'quoted-printable';
import axios, { AxiosResponse } from 'axios';
import { INestApplication } from '@nestjs/common';
import {
  createSubscriptionServiceApp,
  DEFAULT_TEST_TIMEOUT,
  setupTestContainers,
  TestContainers,
} from './utils';
import {
  EmailSenderService,
  TransporterInterface,
} from '../../subscription-service/src/modules/subscription/infrastructure/external/mail/email/email-sender.service';
import { SubscriptionBuilder } from './mocks/subscription.builder';
import { LinkService } from '../../subscription-service/src/modules/subscription/infrastructure/external/link/link.service';
import { subscriptionHtml } from '../../subscription-service/src/modules/subscription/infrastructure/external/mail/email/templates/subscription-confirmation';
import { MailhogMessage } from './utils/mailhog-message.interface';

describe('EmailService Integration Tests', () => {
  let containers: TestContainers;

  let subscriptionServiceApp: INestApplication;

  let emailSenderService: EmailSenderService;
  let linkService: LinkService;
  let transporter: TransporterInterface;

  jest.setTimeout(DEFAULT_TEST_TIMEOUT);

  beforeAll(async () => {
    containers = await setupTestContainers();

    subscriptionServiceApp = await createSubscriptionServiceApp(containers);

    emailSenderService = subscriptionServiceApp.get(EmailSenderService);
    linkService = subscriptionServiceApp.get('LinkServiceInterface');
    transporter = subscriptionServiceApp.get('TransporterInterface');
  });

  afterAll(async () => {
    await subscriptionServiceApp.close();
    await containers.rabbit.container.stop();
    await containers.postgres.container.stop();
    await containers.redis.container.stop();
    await containers.mailhog.container.stop();
  });

  describe('Sending subscription email', () => {
    let mailhogUrl: string;
    let subscriptionEntity: ReturnType<
      typeof SubscriptionBuilder.subscriptionEntity
    >;

    beforeEach(() => {
      subscriptionEntity = SubscriptionBuilder.subscriptionEntity();

      const host = containers.mailhog.container.getHost();
      const port = containers.mailhog.container.getMappedPort(8025);

      mailhogUrl = `http://${host}:${port}`;
    });

    describe('EmailSenderService', () => {
      it('should call sendSubscriptionEmail with expected arguments and return isDelivered', async () => {
        const spy = jest.spyOn(emailSenderService, 'sendSubscriptionEmail');
        const result = await emailSenderService.sendSubscriptionEmail(
          subscriptionEntity.email,
          subscriptionEntity.token,
        );

        expect(spy).toHaveBeenCalledWith(
          subscriptionEntity.email,
          subscriptionEntity.token,
        );
        expect(result).toEqual({
          isDelivered: true,
        });
      });
    });

    describe('Transporter', () => {
      let html: string;
      let mailhogResponse: AxiosResponse<MailhogMessage[]>;
      let message: MailhogMessage;

      beforeEach(async () => {
        const { confirmLink, unsubscribeLink } = linkService.getLinks(
          subscriptionEntity.token,
        );

        html = subscriptionHtml
          .replace('{{confirmLink}}', confirmLink)
          .replace('{{unsubscribeLink}}', unsubscribeLink);

        await transporter.sendMail(subscriptionEntity.email, html);
        mailhogResponse = await axios.get<MailhogMessage[]>(
          `${mailhogUrl}/api/v1/messages`,
        );
        message = mailhogResponse.data[0];
      });

      it('should call sendMail with expected arguments and return isDelivered', async () => {
        const spy = jest.spyOn(transporter, 'sendMail');
        const result = await transporter.sendMail(
          subscriptionEntity.email,
          html,
        );

        expect(spy).toHaveBeenCalledWith(subscriptionEntity.email, html);
        expect(result).toEqual(true);
      });

      it('should send email and verify delivery', () => {
        expect(mailhogResponse.status).toBe(200);
      });

      it('should contain correct sender and recipient', () => {
        expect(message.Raw.From).toBe('staff-base@ukr.net');
        expect(message.Raw.To).toContain(subscriptionEntity.email);
      });

      it('should contain correct subject and HTML content', () => {
        const decodedBody = qp.decode(message.Content.Body);

        expect(message.Content.Headers.Subject[0]).toBe(
          'Confirm your weather subscription',
        );
        expect(decodedBody).toContain(`<h2>Confirm Your Subscription</h2>`);
        expect(decodedBody).toContain(`/confirm/${subscriptionEntity.token}`);
        expect(decodedBody).toContain(
          `/unsubscribe/${subscriptionEntity.token}`,
        );
      });
    });
  });
});
