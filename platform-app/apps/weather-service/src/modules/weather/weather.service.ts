import { Inject, Injectable } from '@nestjs/common';
import { Weather } from '../../entities/weather.entity';
import { WeatherDto } from '../../../../../common/shared';
import { WeatherApiClientServiceInterface } from '../external/weather-api-client.service';
import { weatherTokens } from '../../common';

export interface WeatherServiceInterface {
  getWeatherFromAPI(city: string): Promise<WeatherDto>;
}

export interface WeatherRepositoryInterface {
  createWeather(weather: Partial<Weather>): Weather;
  saveWeather(weather: Weather): Promise<Weather>;
}

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor(
    @Inject(weatherTokens.WEATHER_REPOSITORY_INTERFACE)
    private readonly weatherRepository: WeatherRepositoryInterface,
    @Inject(weatherTokens.WEATHER_SERVICE_PROXY)
    private readonly weatherApiClient: WeatherApiClientServiceInterface,
  ) {}

  async getWeatherFromAPI(city: string): Promise<WeatherDto> {
    city = city.toLowerCase();

    const data = await this.weatherApiClient.fetchWeather(city);

    if (!data.isRecordInCache) {
      const weather: Weather = this.weatherRepository.createWeather({
        city,
        temperature: data.response.temperature,
        humidity: data.response.humidity,
        description: data.response.description,
      });
      await this.weatherRepository.saveWeather(weather);
    }

    return {
      temperature: data.response.temperature,
      humidity: data.response.humidity,
      description: data.response.description,
    };
  }
}
