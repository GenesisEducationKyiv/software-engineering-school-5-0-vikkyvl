import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { SubscriptionDto } from './dto/subscription.dto';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { subscriptionErrors } from '../errors';
import { MessageResponseDto } from '../common/dto/message-response.dto';
import { configService } from '../../config/config.service';
import { EmailSenderService } from '../email/email-sender.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly emailSenderService: EmailSenderService,
  ) {}

  async formSubscription(dto: SubscriptionDto): Promise<MessageResponseDto> {
    const isEmail = await this.subscriptionRepository.findOne({
      where: { email: dto.email },
    });

    if (isEmail) {
      throw new RpcException(subscriptionErrors.EMAIL_ALREADY_SUBSCRIBED);
    }

    const token = uuidv4();

    const baseUrl = configService.getReactAppApiUrl();

    const confirmLink = `${baseUrl}/confirm/${token}`;
    const unsubscribeLink = `${baseUrl}/unsubscribe/${token}`;

    await this.emailSenderService.sendSubscriptionEmail(
      dto.email,
      confirmLink,
      unsubscribeLink,
    );

    const subscription = this.subscriptionRepository.create({
      ...dto,
      confirmed: false,
      token,
    });

    await this.subscriptionRepository.save(subscription);

    return {
      message: 'Confirmation email sent.',
    };
  }
}
