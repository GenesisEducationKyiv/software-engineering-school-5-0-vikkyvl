class ConfigService {
  constructor() {}

  public getBrokerUrl() {
    return process.env.BROKER_URL ?? 'amqps://...';
  }

  public getPort() {
    return process.env.PORT ?? 3001;
  }

  public getQueueName() {
    return process.env.QUEUE_NAME ?? 'subscription-service';
  }

  public getReactAppApiUrl() {
    return process.env.REACT_APP_API_URL;
  }

  public getEmailUser() {
    return process.env.EMAIL_USER;
  }
}

const configService = new ConfigService();
export { configService };
