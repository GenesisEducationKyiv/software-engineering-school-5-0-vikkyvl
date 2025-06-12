import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { patterns } from '../patterns';
import { MicroserviceClient } from '../../common/microservice-client';
import { WeatherDto } from './dto/weather.dto';

@Injectable()
export class WeatherService extends MicroserviceClient {
  constructor(
    @Inject('WEATHER_SERVICE')
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async getWeather(city: string): Promise<WeatherDto> {
    return this.send(patterns.WEATHER.GET_WEATHER, city);
  }
}
