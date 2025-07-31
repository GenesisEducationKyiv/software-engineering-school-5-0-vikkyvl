import axios from 'axios';
import { weatherApiConfigService } from '../config';
import { AbstractWeatherApiDataHandler } from '../weather-api-data-handler';
import { WeatherGeneralResponseDto } from '../dto';
import { WeatherApiResponseDto } from '../dto';

export class WeatherApiHandler extends AbstractWeatherApiDataHandler {
  provider = 'weatherapi.com';
  private readonly apiKey: string;
  private readonly url: string;

  constructor() {
    super();
    this.apiKey = weatherApiConfigService.getKey();
    this.url = weatherApiConfigService.getUrl();
  }

  async fetchWeatherData(request: string): Promise<WeatherGeneralResponseDto> {
    const response = await axios.get<WeatherApiResponseDto>(this.url, {
      params: {
        key: this.apiKey,
        q: request,
      },
      validateStatus: function (status) {
        return status < 400;
      },
    });

    return {
      temperature: response.data.current.temp_c,
      humidity: response.data.current.humidity,
      description: response.data.current.condition.text,
    };
  }
}
