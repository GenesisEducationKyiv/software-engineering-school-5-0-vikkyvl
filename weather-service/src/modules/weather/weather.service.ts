import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weather } from '../../entities/weather.entity';
import { WeatherDto } from "./dto/weather.dto";
import { WeatherShortDto } from "./dto/weather-short.dto";
import { RpcException } from "@nestjs/microservices";
import axios from 'axios';

@Injectable()
export class WeatherService {
    constructor(
        @InjectRepository(Weather)
        private readonly weatherRepository: Repository<Weather>,
    ) {}

    async getWeatherFromAPI(city: string): Promise<WeatherShortDto> {
        const apiKey = process.env.WEATHER_API_KEY;

        try {
            const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
                params: {
                    key: apiKey,
                    q: city,
                },
            });

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

                if (status === 400) {
                   if(hasNonAlphabetChars) {
                       throw new RpcException({ status: 400, message: 'Invalid request' });
                   }
                   else {
                       throw new RpcException({ status: 404, message: 'City not found' });
                   }
                }
            }
            throw new RpcException({ status: 500, message: 'Internal error' });
        }
    }
}
