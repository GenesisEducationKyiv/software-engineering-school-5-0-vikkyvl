class ConfigService {
  constructor() {}

  public getBrokerUrl() {
    return process.env.BROKER_URL ?? 'amqps://...';
  }

  public getPort() {
    return process.env.PORT ?? 3001;
  }

  public getQueueName() {
    return process.env.QUEUE_NAME ?? 'weather-service';
  }
}

const configService = new ConfigService();
export { configService };
