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

  public getWeatherApiUrl() {
    return process.env.WEATHER_API_URL || '';
  }

  public getWeatherApiKey() {
    return process.env.WEATHER_API_KEY;
  }
}

const configService = new ConfigService();
export { configService };
