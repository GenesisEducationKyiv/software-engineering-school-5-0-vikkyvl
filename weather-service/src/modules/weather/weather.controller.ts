import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WeatherService } from "./weather.service";
import {patterns} from "../patterns";

@Controller('weather')
export class WeatherController {
    constructor(private weatherService: WeatherService) {}

    @MessagePattern(patterns.WEATHER.GET_WEATHER)
    async getWeather(data: { city: string }) {
        return this.weatherService.getWeatherFromAPI(data.city);
    }
}
