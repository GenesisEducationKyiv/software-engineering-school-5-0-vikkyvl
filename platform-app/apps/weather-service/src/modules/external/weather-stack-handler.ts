import axios from 'axios';
import { weatherStackConfigService } from './config';
import { AbstractWeatherApiDataHandler } from './weather-api-data-handler';
import { WeatherGeneralResponseDto } from './dto';
import { WeatherStackResponseDto } from './dto/weather-stack-response.dto';
import { weatherErrors } from '../errors';
import { RpcException } from '@nestjs/microservices';
import { logProviderResponse } from './provider-logger';

export class WeatherStackHandler extends AbstractWeatherApiDataHandler {
  constructor() {
    super();
    this.provider = 'weatherstack.com';
    this.apiKey = weatherStackConfigService.getKey();
    this.url = weatherStackConfigService.getUrl();
  }

  async handleRequest(request: string): Promise<WeatherGeneralResponseDto> {
    const response = await axios.get<WeatherStackResponseDto>(this.url, {
      params: {
        access_key: this.apiKey,
        query: request,
      },
      validateStatus: function (status) {
        return status < 400 && status !== 101;
      },
    });

    logProviderResponse(this.provider, response.data);

    if (response.data.success === false || !response.data.current) {
      if (response.data.error?.code === 615) {
        throw new RpcException(weatherErrors.CITY_NOT_FOUND);
      }

      return super.handleRequest(request);
    }

    return {
      temperature: response.data.current.temperature,
      humidity: response.data.current.humidity,
      description: response.data.current.weather_descriptions[0],
    };
  }
}
