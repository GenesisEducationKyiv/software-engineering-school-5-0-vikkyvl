import { Module } from '@nestjs/common';
import { OrmModule } from './orm/orm.module';
import { WeatherModule } from './weather/weather.module';

@Module({
    imports: [OrmModule, WeatherModule],
})
export class ModulesModule {}