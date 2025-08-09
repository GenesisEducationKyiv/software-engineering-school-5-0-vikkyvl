import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherRequestGrpcDto {
  @IsString()
  @IsNotEmpty()
  city: string;
}
