import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weather } from '../../entities/weather.entity';
import { WeatherDto } from './dto/weather.dto';
import { WeatherApiResponse } from './dto/weather-api-response';
import { RpcException } from '@nestjs/microservices';
import axios from 'axios';
import { WeatherShortDto } from './dto/weather-short.dto';
import { weatherErrors } from '../errors';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
  ) {}

  async getWeatherFromAPI(city: string): Promise<WeatherShortDto> {
    const apiKey = process.env.WEATHER_API_KEY;

    try {
      const response = await axios.get<WeatherApiResponse>(
        process.env.WEATHER_API_URL || '',
        {
          params: {
            key: apiKey,
            q: city,
          },
        },
      );

      const weatherData: WeatherDto = {
        city,
        temperature: response.data.current.temp_c,
        humidity: response.data.current.humidity,
        description: response.data.current.condition.text,
      };

      const weather = this.weatherRepository.create(weatherData);
      await this.weatherRepository.save(weather);

      return {
        temperature: response.data.current.temp_c,
        humidity: response.data.current.humidity,
        description: response.data.current.condition.text,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const hasNonAlphabetChars = /[^\p{L}\s-]/u.test(city);

        if (status === weatherErrors.INVALID_REQUEST.status) {
          if (hasNonAlphabetChars) {
            throw new RpcException(weatherErrors.INVALID_REQUEST);
          } else {
            throw new RpcException(weatherErrors.CITY_NOT_FOUND);
          }
        }
      }
      throw new RpcException(weatherErrors.INTERNAL_ERROR);
    }
  }
}
