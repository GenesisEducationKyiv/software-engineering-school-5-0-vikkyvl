import { BrokerConfigInterface } from './interfaces/broker-config.interface';
import { ClientConfigInterface } from './interfaces/client-config.interface';

class SubscriptionConfigService
  implements BrokerConfigInterface, ClientConfigInterface
{
  constructor() {}

  public getBrokerUrl() {
    return process.env.BROKER_URL ?? 'amqps://...';
  }

  public getTTL() {
    return Number(process.env.SUBSCRIPTION_TTL ?? 3600000);
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
}

const subscriptionConfigService = new SubscriptionConfigService();

export { subscriptionConfigService };
