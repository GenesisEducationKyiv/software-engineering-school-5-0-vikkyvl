import { BrokerConfigInterface } from './interfaces/broker-config.interface';
import { ClientConfigInterface } from './interfaces/client-config.interface';
import { EmailConfigInterface } from './interfaces/email-config.interface';

class NotificationConfigService
  implements BrokerConfigInterface, ClientConfigInterface, EmailConfigInterface
{
  public getBrokerUrl() {
    return process.env.BROKER_URL ?? 'amqps://...';
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

  public getEmailUser() {
    return process.env.EMAIL_USER;
  }

  public getEmailPassword() {
    return process.env.EMAIL_PASSWORD;
  }
}

const notificationConfigService = new NotificationConfigService();

export { notificationConfigService };
