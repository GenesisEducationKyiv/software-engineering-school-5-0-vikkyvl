import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from '../src/modules/subscription/subscription.service';
import { EmailSenderServiceInterface } from '../src/modules/external/mail/email/email-sender.service';
import { SubscriptionRepositoryInterface } from '../src/modules/repository/subscription.repository.interface';
import { SubscriptionServiceBuilder } from './mocks/subscription.service..builder';
import { RpcException } from '@nestjs/microservices';
import { subscriptionErrors } from '../src/modules/errors';
import { LinkServiceInterface } from '../src/modules/link/link.service';

describe('Subscription Service (unit)', () => {
  let service: SubscriptionService;
  let mockRepository: jest.Mocked<SubscriptionRepositoryInterface>;
  let mockEmailService: jest.Mocked<EmailSenderServiceInterface>;
  let mockLinkService: jest.Mocked<LinkServiceInterface>;

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
          provide: 'EmailSenderServiceInterface',
          useValue: {
            sendSubscriptionEmail: jest.fn(),
          },
        },
        {
          provide: 'LinkServiceInterface',
          useValue: {
            getLinks: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    mockRepository = module.get('SubscriptionRepositoryInterface');
    mockEmailService = module.get('EmailSenderServiceInterface');
    mockLinkService = module.get('LinkServiceInterface');
  });

  describe('formSubscription()', () => {
    let userForm: ReturnType<typeof SubscriptionServiceBuilder.userForm>;
    let links: ReturnType<typeof SubscriptionServiceBuilder.links>;

    beforeEach(() => {
      userForm = SubscriptionServiceBuilder.userForm();
      links = SubscriptionServiceBuilder.links();

      mockRepository.findByEmail.mockResolvedValue(null);
      mockLinkService.getLinks.mockReturnValue(links);
      mockEmailService.sendSubscriptionEmail.mockResolvedValue({
        isDelivered: false,
      });
    });

    it('should throw throw RpcException if email not delivered and not call repository methods', async () => {
      await expect(service.formSubscription(userForm)).rejects.toThrow(
        new RpcException(subscriptionErrors.EMAIL_SENDING_FAILED),
      );

      expect(mockRepository.createSubscription).not.toHaveBeenCalled();
      expect(mockRepository.saveSubscription).not.toHaveBeenCalled();
    });
  });
});
