import * as nodemailer from 'nodemailer';
import { configService } from '../../../../../../../common/config/subscription-config.service';

export const transporter = nodemailer.createTransport({
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
