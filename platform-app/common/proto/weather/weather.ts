import { WeatherRequestGrpcDto, WeatherResponseGrpcDto } from '../../shared';
import { Observable } from 'rxjs';

export interface WeatherServiceInterface {
  getWeather(dto: WeatherRequestGrpcDto): Observable<WeatherResponseGrpcDto>;
}
