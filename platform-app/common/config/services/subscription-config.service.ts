import { BrokerConfigInterface } from './interfaces/broker-config.interface';
import { ClientConfigInterface } from './interfaces/client-config.interface';
import { EmailConfigInterface } from './interfaces/email-config.interface';

class SubscriptionConfigService
  implements BrokerConfigInterface, ClientConfigInterface, EmailConfigInterface
{
  constructor() {}

  public getBrokerUrl() {
    return process.env.BROKER_URL ?? 'amqps://...';
  }

  public getPort() {
    return process.env.PORT_SUBSCRIPTION_SERVICE ?? 3002;
  }

  public getQueueName() {
    return process.env.SUBSCRIPTION_SERVICE ?? 'subscription-service';
  }

  public getReactAppApiUrl() {
    return process.env.REACT_APP_API_URL;
  }

  public getEmailUser() {
    return process.env.EMAIL_USER;
  }

  public getEmailPassword() {
    return process.env.EMAIL_PASSWORD;
  }
}

const subscriptionConfigService = new SubscriptionConfigService();

export { subscriptionConfigService };
