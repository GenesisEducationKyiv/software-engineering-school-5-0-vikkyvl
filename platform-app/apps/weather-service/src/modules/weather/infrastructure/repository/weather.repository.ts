import { Injectable } from '@nestjs/common';
import { WeatherRepositoryInterface } from './interfaces/weather.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from '../../../../entities/weather.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeatherRepository implements WeatherRepositoryInterface {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
  ) {}

  createWeather(weather: Partial<Weather>): Weather {
    return this.weatherRepository.create(weather);
  }

  async saveWeather(weather: Weather): Promise<Weather> {
    return this.weatherRepository.save(weather);
  }
}
