export interface WeatherStackResponseDto {
  error?: {
    code: number;
  };
  success?: boolean;
  current?: {
    temperature: number;
    humidity: number;
    weather_descriptions: string[];
  };
}
