import axios, { AxiosError } from 'axios';
import { openWeatherMapConfigService } from './config';
import { AbstractWeatherApiDataHandler } from './weather-api-data-handler';
import { WeatherGeneralResponseDto } from './dto';
import { OpenWeatherMapResponseDto } from './dto/open-weather-map-response.dto';
import { weatherErrors } from '../../common';
import { RpcException } from '@nestjs/microservices';
import { logProviderResponse } from './provider-logger';

export class OpenWeatherMapHandler extends AbstractWeatherApiDataHandler {
  constructor() {
    super();
    this.provider = 'openweathermap.org';
    this.apiKey = openWeatherMapConfigService.getKey();
    this.url = openWeatherMapConfigService.getUrl();
  }

  async handleRequest(request: string): Promise<WeatherGeneralResponseDto> {
    try {
      const response = await axios.get<OpenWeatherMapResponseDto>(this.url, {
        params: {
          q: request,
          appid: this.apiKey,
          units: 'metric',
        },
        validateStatus: function (status) {
          return status < 400;
        },
      });

      logProviderResponse(this.provider, response.data);

      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
      };
    } catch (error: unknown) {
      const err = error as AxiosError;

      logProviderResponse(this.provider, err.response?.status);

      if (err.response?.status === weatherErrors.STATUS_404.status) {
        throw new RpcException(weatherErrors.CITY_NOT_FOUND);
      }

      return super.handleRequest(request);
    }
  }
}
