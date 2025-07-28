import { EmailConfigInterface } from '../services/interfaces/email-config.interface';

class MailConfigService implements EmailConfigInterface {
  private emailHost: string;
  private emailPort: number;
  private emailSecure: boolean;

  constructor() {
    this.emailHost = process.env.EMAIL_HOST ?? 'smtp.ukr.net';
    this.emailPort = Number(process.env.EMAIL_PORT ?? 465);
    this.emailSecure = Boolean(process.env.EMAIL_SECURE ?? true);
  }

  public getEmailHost() {
    return this.emailHost;
  }

  public getEmailPort() {
    return this.emailPort;
  }

  public getEmailSecure() {
    return this.emailSecure;
  }

  public getEmailUser() {
    return process.env.EMAIL_USER ?? '';
  }

  public getEmailPassword() {
    return process.env.EMAIL_PASSWORD ?? '';
  }

  public setEmailHost(host: string) {
    this.emailHost = host;
  }

  public setEmailPort(port: number) {
    this.emailPort = port;
  }

  public setEmailSecure(secure: boolean) {
    this.emailSecure = secure;
  }
}

const mailConfigService = new MailConfigService();

export { mailConfigService };
