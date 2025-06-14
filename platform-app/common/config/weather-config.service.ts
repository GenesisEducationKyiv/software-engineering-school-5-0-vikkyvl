import { BrokerConfigInterface } from './interfaces/broker-config.interface';
import { WeatherApiConfigInterface } from './interfaces/weather-api-config.interface';

class WeatherConfigService
  implements BrokerConfigInterface, WeatherApiConfigInterface
{
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

  public getWeatherApiUrl() {
    return process.env.WEATHER_API_URL || '';
  }

  public getWeatherApiKey() {
    return process.env.WEATHER_API_KEY;
  }
}

const configService = new WeatherConfigService();

export { configService };
