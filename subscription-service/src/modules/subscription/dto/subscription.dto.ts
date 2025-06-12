import { Frequency } from '../../../common/enums/frequency.enum';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class SubscriptionDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  city: string;

  @IsEnum(Frequency)
  frequency: Frequency;
}
