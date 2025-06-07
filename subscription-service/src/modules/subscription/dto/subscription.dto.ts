import { Frequency } from "../../../common/enums/frequency.enum";

export interface SubscriptionDto {
  email: string;
  city: string;
  frequency: Frequency;
}
