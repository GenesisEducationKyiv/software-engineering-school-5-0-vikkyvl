import * as nodemailer from 'nodemailer';
import { configService } from '../../../../../../../../common/config/subscription-config.service';
import { Injectable } from '@nestjs/common';
import { TransporterInterface } from '../email-sender.service';

@Injectable()
export class Transporter implements TransporterInterface {
  private readonly transporter: nodemailer.Transporter;
  private isDelivered: boolean = true;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ukr.net',
      port: 465,
      secure: true,
      auth: {
        user: configService.getEmailUser(),
        pass: configService.getEmailPassword(),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private async verify(): Promise<boolean> {
    return await this.transporter.verify();
  }

  public async sendMail(email: string, html: string): Promise<boolean> {
    if (!(await this.verify())) {
      return (this.isDelivered = false);
    }

    await this.transporter.sendMail({
      from: `Weather API Application <${configService.getEmailUser()}>`,
      to: email,
      subject: 'Confirm your weather subscription',
      html,
    });

    return this.isDelivered;
  }
}
