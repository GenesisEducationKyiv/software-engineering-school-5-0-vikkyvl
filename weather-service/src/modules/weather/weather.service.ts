import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weather } from '../../entities/weather.entity';
import { WeatherApiResponse } from './dto/weather-api-response';
import { RpcException } from '@nestjs/microservices';
import axios from 'axios';
import { WeatherDto } from './dto/weather.dto';
import { weatherErrors } from '../errors';
import { configService } from '../../config/config.service';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
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

    const weather: Weather = this.weatherRepository.create({
      city,
      temperature: response.data.current.temp_c,
      humidity: response.data.current.humidity,
      description: response.data.current.condition.text,
    });
    await this.weatherRepository.save(weather);

    return {
      temperature: response.data.current.temp_c,
      humidity: response.data.current.humidity,
      description: response.data.current.condition.text,
    };
  }
}
