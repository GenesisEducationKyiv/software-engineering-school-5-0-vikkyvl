export interface WeatherApiConfigInterface {
  getUrl(): string;
  getKey(): string | undefined;
}
