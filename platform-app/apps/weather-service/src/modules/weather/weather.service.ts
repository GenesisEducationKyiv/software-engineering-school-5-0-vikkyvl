import { Inject, Injectable } from '@nestjs/common';
import { Weather } from '../../entities/weather.entity';
import { WeatherDto } from '../../../../../common/shared';
import { WeatherApiClientServiceInterface } from '../external/weather-api-client.service';
import { WeatherServiceInterface } from './interface';

export interface WeatherRepositoryInterface {
  createWeather(weather: Partial<Weather>): Weather;
  saveWeather(weather: Weather): Promise<Weather>;
}

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor(
    @Inject('WeatherRepositoryInterface')
    private readonly weatherRepository: WeatherRepositoryInterface,
    @Inject('WeatherApiClientServiceInterface')
    private readonly weatherApiClient: WeatherApiClientServiceInterface,
  ) {}

  async getWeatherFromAPI(city: string): Promise<WeatherDto> {
    const response = await this.weatherApiClient.fetchWeather(city);

    const weather: Weather = this.weatherRepository.createWeather({
      city,
      temperature: response.temperature,
      humidity: response.humidity,
      description: response.description,
    });
    await this.weatherRepository.saveWeather(weather);

    return {
      temperature: response.temperature,
      humidity: response.humidity,
      description: response.description,
    };
  }
}
