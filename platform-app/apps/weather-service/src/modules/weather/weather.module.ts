import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from '../../entities/weather.entity';
import { WeatherRepository } from '../repository/weather.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Weather])],
  controllers: [WeatherController],
  providers: [
    { provide: 'WeatherRepositoryInterface', useClass: WeatherRepository },
    WeatherService,
    WeatherRepository,
  ],
  exports: [WeatherService],
})
export class WeatherModule {}
