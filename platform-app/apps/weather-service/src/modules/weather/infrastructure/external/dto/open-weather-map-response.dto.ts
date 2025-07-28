export interface OpenWeatherMapResponseDto {
  main: {
    temp: number;
    humidity: number;
  };
  weather: [
    {
      description: string;
    },
  ];
}
