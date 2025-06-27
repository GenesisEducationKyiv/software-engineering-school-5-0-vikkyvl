export interface WeatherApiConfigInterface {
  getWeatherApiUrl(): string;
  getWeatherApiKey(): string | undefined;
}
