import { Weather } from '../../../../../entities/weather.entity';

export interface WeatherRepositoryInterface {
  createWeather(weather: Partial<Weather>): Weather;
  saveWeather(weather: Weather): Promise<Weather>;
}
