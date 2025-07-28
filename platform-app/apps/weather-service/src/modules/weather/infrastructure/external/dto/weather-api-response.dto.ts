export interface WeatherApiResponseDto {
  current: {
    temp_c: number;
    humidity: number;
    condition: {
      text: string;
    };
  };
}
