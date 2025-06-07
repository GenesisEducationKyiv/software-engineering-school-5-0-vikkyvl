import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { patterns } from '../patterns';
import { MicroserviceClient } from '../../common/microservice-client';

@Injectable()
export class WeatherService extends MicroserviceClient {
  constructor(
    @Inject('WEATHER_SERVICE')
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async getWeather(city: string): Promise<WeatherService> {
    return this.send(patterns.WEATHER.GET_WEATHER, { city });
  }
}
