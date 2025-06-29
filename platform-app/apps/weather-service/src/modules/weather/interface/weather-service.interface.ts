import { WeatherDto } from '../../../../../../common/shared';

export interface WeatherServiceInterface {
  getWeatherFromAPI(city: string): Promise<WeatherDto>;
}
