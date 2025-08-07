import { BrokerConfigInterface } from './interfaces/broker-config.interface';
import { ClientConfigInterface } from './interfaces/client-config.interface';

class NotificationConfigService
  implements BrokerConfigInterface, ClientConfigInterface
{
  public getBrokerUrl() {
    return process.env.BROKER_URL ?? 'amqps://...';
  }

  public getTTL() {
    return Number(process.env.NOTIFICATION_TTL ?? 3600000);
  }

  public getPort() {
    return process.env.PORT_SUBSCRIPTION_SERVICE ?? 3003;
  }

  public getQueueName() {
    return process.env.NOTIFICATION_SERVICE ?? 'notification-service';
  }

  public getReactAppApiUrl() {
    return process.env.REACT_APP_API_URL;
  }
}

const notificationConfigService = new NotificationConfigService();

export { notificationConfigService };
