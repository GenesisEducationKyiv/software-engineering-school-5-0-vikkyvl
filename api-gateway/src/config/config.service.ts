class ConfigService {
  constructor() {}

  public getBrokerUrl() {
    return process.env.BROKER_URL ?? 'amqps://...';
  }

  public getPort() {
    return process.env.PORT ?? 3000;
  }

  public getQueueName() {
    return process.env.API_GATEWAY ?? 'api-gateway';
  }
}

const configService = new ConfigService();
export { configService };
