import { Injectable } from '@nestjs/common';
import { configService } from '../../../../../common/config/weather-config.service';
import axios from 'axios';
import { WeatherApiResponse } from './dto/weather-api-response';
import { weatherErrors } from '../errors';
import { RpcException } from '@nestjs/microservices';

export interface WeatherApiClientServiceInterface {
  fetchWeather(city: string): Promise<WeatherApiResponse>;
}

@Injectable()
export class WeatherApiClientService
  implements WeatherApiClientServiceInterface
{
  private readonly apiKey = configService.getWeatherApiKey();

  async fetchWeather(city: string): Promise<WeatherApiResponse> {
    const response = await axios.get<WeatherApiResponse>(
      configService.getWeatherApiUrl(),
      {
        params: {
          key: this.apiKey,
          q: city,
        },
        validateStatus: function (status) {
          return status <= 400;
        },
      },
    );

    if (response.status === weatherErrors.INVALID_REQUEST.status) {
      throw new RpcException(weatherErrors.CITY_NOT_FOUND);
    }

    return response.data;
  }
}
