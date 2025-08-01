import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherRequestHttpDto {
  @IsString()
  @IsNotEmpty()
  city: string;
}
