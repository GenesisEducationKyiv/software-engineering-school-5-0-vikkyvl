import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WeatherService } from './weather.service';
import { patterns } from '../patterns';
import { WeatherShortDto } from './dto/weather-short.dto';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @MessagePattern(patterns.WEATHER.GET_WEATHER)
  async getWeather(data: { city: string }): Promise<WeatherShortDto> {
    return this.weatherService.getWeatherFromAPI(data.city);
  }
}
