import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { patterns } from '../../../../../common/shared/constants/patterns';
import { MicroserviceClient } from '../../common/microservice-client';
import { WeatherDto } from '../../../../../common/shared/dtos/weather/weather.dto';

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
