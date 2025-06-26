import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from '../src/modules/subscription/subscription.service';
import { EmailSenderService } from '../src/modules/external/mail/email/email-sender.service';
import { SubscriptionRepositoryInterface } from '../src/modules/repository/subscription.repository.interface';
import { SubscriptionServiceBuilder } from './mocks/subscription.service..builder';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors } from '../src/modules/errors';
import { Subscription } from '../src/entities/subscription.entity';

describe('Subscription Service (unit)', () => {
  let service: SubscriptionService;
  let mockRepository: jest.Mocked<SubscriptionRepositoryInterface>;
  let mockEmailService: jest.Mocked<EmailSenderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: 'SubscriptionRepositoryInterface',
          useValue: {
            findByEmail: jest.fn(),
            createSubscription: jest.fn(),
            saveSubscription: jest.fn(),
          },
        },
        {
          provide: EmailSenderService,
          useValue: {
            sendSubscriptionEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    mockRepository = module.get('SubscriptionRepositoryInterface');
    mockEmailService = module.get(EmailSenderService);
  });

  describe('formSubscription()', () => {
    let userFormWithExistingEmail: ReturnType<
      typeof SubscriptionServiceBuilder.userFormWithExistingEmail
    >;
    let userFormWithWrongEmail: ReturnType<
      typeof SubscriptionServiceBuilder.userFormWithWrongEmail
    >;
    let subscriptionEntity: ReturnType<
      typeof SubscriptionServiceBuilder.subscriptionEntity
    >;

    beforeEach(() => {
      userFormWithExistingEmail =
        SubscriptionServiceBuilder.userFormWithExistingEmail();
      userFormWithWrongEmail =
        SubscriptionServiceBuilder.userFormWithWrongEmail();
      subscriptionEntity = SubscriptionServiceBuilder.subscriptionEntity();

      mockRepository.findByEmail.mockImplementation(
        (email: string): Promise<Subscription | null> => {
          if (email === userFormWithExistingEmail.email) {
            return Promise.resolve(subscriptionEntity);
          }

          return Promise.resolve(null);
        },
      );

      mockEmailService.sendSubscriptionEmail.mockImplementation(
        (email: string) => {
          if (email === userFormWithWrongEmail.email) {
            return Promise.resolve({ isDelivered: false });
          }

          return Promise.resolve({ isDelivered: true });
        },
      );
    });

    it('should call repository methods and return confirmation message', async () => {
      await expect(
        service.formSubscription(userFormWithExistingEmail),
      ).rejects.toThrow(
        new RpcException(subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED),
      );

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(
        userFormWithExistingEmail.email,
      );
      expect(mockEmailService.sendSubscriptionEmail).not.toHaveBeenCalled();
    });

    it('should throw RpcException if email not delivered and not call repository methods', async () => {
      await expect(
        service.formSubscription(userFormWithWrongEmail),
      ).rejects.toThrow(
        new RpcException(subscriptionErrors.EMAIL_SENDING_FAILED),
      );

      expect(mockRepository.createSubscription).not.toHaveBeenCalled();
      expect(mockRepository.saveSubscription).not.toHaveBeenCalled();
    });
  });
});
