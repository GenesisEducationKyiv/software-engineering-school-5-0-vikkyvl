import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { patterns } from '../../../../../common/shared';
import { MicroserviceClient } from '../../shared';
import { WeatherResponseDto } from '../../../../../common/shared';

@Injectable()
export class WeatherService extends MicroserviceClient {
  constructor(
    @Inject('WEATHER_SERVICE')
    protected client: ClientProxy,
  ) {
    super(client);
  }

  async getWeather(city: string): Promise<WeatherResponseDto> {
    return this.send(patterns.WEATHER.GET_WEATHER, city);
  }
}
