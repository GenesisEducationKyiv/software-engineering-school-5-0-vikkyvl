import { Inject, Injectable } from '@nestjs/common';
import { Weather } from '../../entities/weather.entity';
import { WeatherApiResponse } from './dto/weather-api-response';
import { RpcException } from '@nestjs/microservices';
import axios from 'axios';
import { WeatherDto } from '../../../../../common/shared/dtos/weather/weather.dto';
import { weatherErrors } from '../errors';
import { configService } from '../../../../../common/config/weather-config.service';

interface WeatherServiceInterface {
  getWeatherFromAPI(city: string): Promise<WeatherDto>;
}

export interface WeatherRepositoryInterface {
  createWeather(weather: Partial<Weather>): Weather;
  saveWeather(weather: Weather): Promise<Weather>;
}

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor(
    @Inject('WeatherRepositoryInterface')
    private readonly weatherRepository: WeatherRepositoryInterface,
  ) {}

  async getWeatherFromAPI(city: string): Promise<WeatherDto> {
    const apiKey = configService.getWeatherApiKey();

    const response = await axios.get<WeatherApiResponse>(
      configService.getWeatherApiUrl(),
      {
        params: {
          key: apiKey,
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

    const weather: Weather = this.weatherRepository.createWeather({
      city,
      temperature: response.data.current.temp_c,
      humidity: response.data.current.humidity,
      description: response.data.current.condition.text,
    });
    await this.weatherRepository.saveWeather(weather);

    return {
      temperature: response.data.current.temp_c,
      humidity: response.data.current.humidity,
      description: response.data.current.condition.text,
    };
  }
}
