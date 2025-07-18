import { GrpcConfigInterface } from './interfaces/grpc-config.interface';

class WeatherConfigService implements GrpcConfigInterface {
  constructor() {}

  public getPort() {
    return process.env.PORT_WEATHER_SERVICE ?? 3001;
  }

  public getGrpcUrl() {
    return process.env.GRPC_URL ?? '';
  }

  public getPackageName() {
    return process.env.GRPC_PACKAGE_NAME ?? 'weather';
  }
}

const weatherConfigService = new WeatherConfigService();

export { weatherConfigService };
