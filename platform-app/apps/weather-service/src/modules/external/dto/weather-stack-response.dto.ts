export interface WeatherStackResponseDto {
  error?: {
    code: number;
    info: string;
  };
  success?: boolean;
  current: {
    temperature: number;
    humidity: number;
    weather_descriptions: string[];
  };
}
