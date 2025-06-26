import axios, { AxiosError } from 'axios';
import { weatherApiConfigService } from './config';
import { AbstractWeatherApiDataHandler } from './weather-api-data-handler';
import { WeatherGeneralResponseDto } from './dto';
import { WeatherApiResponseDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { weatherErrors } from '../errors';
import { logProviderResponse } from './provider-logger';

export class WeatherApiHandler extends AbstractWeatherApiDataHandler {
  constructor() {
    super();
    this.provider = 'weatherapi.com';
    this.apiKey = weatherApiConfigService.getKey();
    this.url = weatherApiConfigService.getUrl();
  }

  async handleRequest(request: string): Promise<WeatherGeneralResponseDto> {
    try {
      const response = await axios.get<WeatherApiResponseDto>(this.url, {
        params: {
          key: this.apiKey,
          q: request,
        },
        validateStatus: function (status) {
          return status < 400;
        },
      });

      logProviderResponse(this.provider, response.data);

      return {
        temperature: response.data.current.temp_c,
        humidity: response.data.current.humidity,
        description: response.data.current.condition.text,
      };
    } catch (error: unknown) {
      const err = error as AxiosError;

      logProviderResponse(this.provider, err.response?.status);

      if (err.response?.status === weatherErrors.STATUS_400.status) {
        throw new RpcException(weatherErrors.CITY_NOT_FOUND);
      }

      return super.handleRequest(request);
    }
  }
}
