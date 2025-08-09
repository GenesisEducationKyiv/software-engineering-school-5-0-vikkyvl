import { Frequency } from '../../enums/frequency.enum';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class SubscriptionRequestDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  city: string;

  @IsEnum(Frequency)
  frequency: Frequency;
}
