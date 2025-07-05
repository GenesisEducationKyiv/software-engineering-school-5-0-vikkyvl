import { WeatherResponseDto } from '../../../../../common/shared';

export interface WeatherServiceInterface {
  getWeatherFromAPI(city: string): Promise<WeatherResponseDto>;
}
