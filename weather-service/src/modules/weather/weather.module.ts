import { Module } from '@nestjs/common';
import { WeatherController } from "./weather.controller";
import { WeatherService } from "./weather.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Weather} from "../../entities/weather.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Weather])],
    controllers: [WeatherController],
    providers: [WeatherService],
    exports: [WeatherService],
})
export class WeatherModule {}
