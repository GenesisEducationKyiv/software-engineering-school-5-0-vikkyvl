import { BrokerConfigInterface } from './interfaces/broker-config.interface';

class WeatherConfigService implements BrokerConfigInterface {
  constructor() {}

  public getBrokerUrl() {
    return process.env.BROKER_URL ?? 'amqps://...';
  }

  public getPort() {
    return process.env.PORT_WEATHER_SERVICE ?? 3001;
  }

  public getQueueName() {
    return process.env.WEATHER_SERVICE ?? 'weather-service';
  }
}

const weatherConfigService = new WeatherConfigService();

export { weatherConfigService };
