import { WeatherRequestDto, WeatherResponseDto } from '../../shared';
import { Observable } from 'rxjs';

export interface WeatherServiceInterface {
  getWeather(dto: WeatherRequestDto): Observable<WeatherResponseDto>;
}
