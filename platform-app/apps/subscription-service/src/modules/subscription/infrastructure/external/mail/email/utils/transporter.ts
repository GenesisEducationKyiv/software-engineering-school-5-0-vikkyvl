import * as nodemailer from 'nodemailer';
import { mailConfigService } from '../../../../../../../../../../common/config';
import { Injectable } from '@nestjs/common';
import { TransporterInterface } from '../email-sender.service';

@Injectable()
export class Transporter implements TransporterInterface {
  private readonly transporter: nodemailer.Transporter;
  private isDelivered: boolean = true;

  constructor() {
    const user = mailConfigService.getEmailUser();
    const pass = mailConfigService.getEmailPassword();

    this.transporter = nodemailer.createTransport({
      host: mailConfigService.getEmailHost(),
      port: Number(mailConfigService.getEmailPort()),
      secure: Boolean(mailConfigService.getEmailSecure()),
      ...(user ? { auth: pass ? { user, pass } : { user } } : {}),
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
      from: `Weather API Application <${mailConfigService.getEmailUser()}>`,
      to: email,
      subject: 'Confirm your weather subscription',
      html,
    });

    return this.isDelivered;
  }
}
