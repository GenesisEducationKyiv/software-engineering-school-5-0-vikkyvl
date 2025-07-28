import * as nodemailer from 'nodemailer';
import { mailConfigService } from '../../../../../../../../../../common/config';
import { Injectable } from '@nestjs/common';
import { TransporterInterface } from '../email-sender.service';

@Injectable()
export class Transporter implements TransporterInterface {
  private readonly transporter: nodemailer.Transporter;
  private isDelivered: boolean = true;
  private readonly user = mailConfigService.getEmailUser();
  private readonly pass = mailConfigService.getEmailPassword();

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: mailConfigService.getEmailHost(),
      port: Number(mailConfigService.getEmailPort()),
      secure: Boolean(mailConfigService.getEmailSecure()),
      ...(this.user && this.pass
        ? { auth: { user: this.user, pass: this.pass } }
        : {}),
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
      from: `Weather API Application <${this.user}>`,
      to: email,
      subject: 'Confirm your weather subscription',
      html,
    });

    return this.isDelivered;
  }
}
