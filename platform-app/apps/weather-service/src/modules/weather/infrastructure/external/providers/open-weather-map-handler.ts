import axios from 'axios';
import { openWeatherMapConfigService } from '../config';
import { AbstractWeatherApiDataHandler } from '../weather-api-data-handler';
import { WeatherGeneralResponseDto } from '../dto';
import { OpenWeatherMapResponseDto } from '../dto/open-weather-map-response.dto';

export class OpenWeatherMapHandler extends AbstractWeatherApiDataHandler {
  provider = 'openweathermap.org';
  private readonly apiKey: string;
  private readonly url: string;

  constructor() {
    super();
    this.apiKey = openWeatherMapConfigService.getKey();
    this.url = openWeatherMapConfigService.getUrl();
  }

  async fetchWeatherData(request: string): Promise<WeatherGeneralResponseDto> {
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

    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
    };
  }
}
