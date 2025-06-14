import { BrokerConfigInterface } from './interfaces/broker-config.interface';

class ApiGatewayConfigService implements BrokerConfigInterface {
  constructor() {}

  public getBrokerUrl() {
    return process.env.BROKER_URL ?? 'amqps://...';
  }

  public getPort() {
    return process.env.PORT_API_GATEWAY ?? 3000;
  }

  public getQueueName() {
    return process.env.API_GATEWAY ?? 'api-gateway';
  }
}

const configService = new ApiGatewayConfigService();

export { configService };
