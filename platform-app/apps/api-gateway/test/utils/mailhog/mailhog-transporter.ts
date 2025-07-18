import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { TransporterInterface } from '../../../../subscription-service/src/modules/subscription/infrastructure/external/mail/email/email-sender.service';
import { TestContainers } from '../setup/setup-containers';

@Injectable()
export class MailhogTransporter implements TransporterInterface {
  private readonly transporter: nodemailer.Transporter;
  private isDelivered = true;

  constructor(private readonly containers: TestContainers) {
    this.transporter = nodemailer.createTransport({
      host: this.containers.mailhog.host,
      port: this.containers.mailhog.smtpPort,
      secure: false,
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
      from: 'Weather API Application <test@mailhog.local>',
      to: email,
      subject: 'Confirm your weather subscription',
      html,
    });

    return this.isDelivered;
  }
}
