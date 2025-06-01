import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { SubscriptionDto } from './dto/subscription.dto';
import {RpcException} from "@nestjs/microservices";
import {v4 as uuidv4} from "uuid";
import {subscriptionErrors} from '../errors';
import { transporter } from '../../utils/transporter'

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
    ) {}

    async formSubscription(dto:SubscriptionDto): Promise<any> {
        const isEmail = await this.subscriptionRepository.findOne({ where: { email: dto.email } });

        if (isEmail) {
            throw new RpcException(subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED);
        }

        const token = uuidv4();

        const subscription = this.subscriptionRepository.create({
            ...dto,
            confirmed: false,
            token,
        });

        await this.subscriptionRepository.save(subscription);

        const baseUrl = process.env.REACT_APP_API_URL;

        const confirmLink = `${baseUrl}/confirm/${token}`;
        const unsubscribeLink = `${baseUrl}/unsubscribe/${token}`;

        await transporter.sendMail({
            from: `Weather API Application <${process.env.EMAIL_USER}>`,
            to: dto.email,
            subject: 'Confirm your weather subscription',
            html: `
                <h2>Confirm Your Subscription</h2>
                <p>Click the link below to confirm your subscription:</p>
                <a href="${confirmLink}">Confirm</a>
            
                <p>If you did not request this or want to unsubscribe, click here:</p>
                <a href="${unsubscribeLink}">Unsubscribe</a>
            `
        });

        return {
            status: "Confirmation email sent."
        }
    }
}
