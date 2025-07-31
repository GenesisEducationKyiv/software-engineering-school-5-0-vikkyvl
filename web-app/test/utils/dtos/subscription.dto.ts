import {Frequency} from "../enums/frequency.enum";

export interface SubscriptionDto {
    email: string;
    city: string;
    frequency: Frequency;
}