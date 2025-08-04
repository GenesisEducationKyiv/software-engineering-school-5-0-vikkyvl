import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherRequestDto {
  @IsString()
  @IsNotEmpty()
  city: string;
}
