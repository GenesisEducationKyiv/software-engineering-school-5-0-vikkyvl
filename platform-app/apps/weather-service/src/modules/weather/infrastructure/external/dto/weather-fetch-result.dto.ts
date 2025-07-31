import { WeatherGeneralResponseDto } from './weather-general-response.dto';

export interface WeatherFetchResult {
  response: WeatherGeneralResponseDto;
  isRecordInCache?: boolean;
}
