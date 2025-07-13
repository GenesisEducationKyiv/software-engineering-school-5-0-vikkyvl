import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  patternsGRPC,
  WeatherRequestDto,
  WeatherResponseDto,
} from '../../../../../common/shared';
import { serviceTokens } from '../../common';
import { MicroserviceClientGrpc } from '../../shared';
import { WeatherServiceInterface } from '../../../../../common/proto/weather/weather';

@Injectable()
export class WeatherService extends MicroserviceClientGrpc<WeatherServiceInterface> {
  constructor(
    @Inject(serviceTokens.WEATHER_SERVICE)
    protected client: ClientGrpc,
  ) {
    super(client, patternsGRPC.WEATHER.SERVICE);
  }

  async getWeather(dto: WeatherRequestDto): Promise<WeatherResponseDto> {
    return this.send(this.service.getWeather(dto));
  }
}
