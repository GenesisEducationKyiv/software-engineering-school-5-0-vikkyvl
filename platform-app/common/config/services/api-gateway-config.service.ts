import { BrokerConfigInterface } from './interfaces/broker-config.interface';
import { ClientConfigInterface } from './interfaces/client-config.interface';
import { GrpcConfigInterface } from './interfaces/grpc-config.interface';

class ApiGatewayConfigService
  implements BrokerConfigInterface, ClientConfigInterface, GrpcConfigInterface
{
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

  public getReactAppApiUrl() {
    return process.env.REACT_APP_API_URL;
  }

  public getGrpcUrl() {
    return process.env.GRPC_URL ?? '';
  }

  public getPackageName() {
    return process.env.GRPC_PACKAGE_NAME ?? 'weather';
  }
}

const apiConfigService = new ApiGatewayConfigService();

export { apiConfigService };
