import axios from 'axios';
import { weatherStackConfigService } from '../config';
import { AbstractWeatherApiDataHandler } from '../weather-api-data-handler';
import { WeatherGeneralResponseDto } from '../dto';
import { WeatherStackResponseDto } from '../dto/weather-stack-response.dto';
import { weatherErrors } from '../../../../../common';
import { RpcException } from '@nestjs/microservices';

export class WeatherStackHandler extends AbstractWeatherApiDataHandler {
  provider = 'weatherstack.com';
  private readonly apiKey: string;
  private readonly url: string;

  constructor() {
    super();
    this.apiKey = weatherStackConfigService.getKey();
    this.url = weatherStackConfigService.getUrl();
  }

  async fetchWeatherData(request: string): Promise<WeatherGeneralResponseDto> {
    const response = await axios.get<WeatherStackResponseDto>(this.url, {
      params: {
        access_key: this.apiKey,
        query: request,
      },
      validateStatus: function (status) {
        return status < 400 && status !== 101;
      },
    });

    if (response.data.success === false || !response.data.current) {
      if (response.data.error?.code === 615) {
        throw new RpcException(weatherErrors.CITY_NOT_FOUND);
      }
    }

    return {
      temperature: response.data.current.temperature,
      humidity: response.data.current.humidity,
      description: response.data.current.weather_descriptions[0],
    };
  }
}
