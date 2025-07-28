import { EmailConfigInterface } from '../services/interfaces/email-config.interface';

class MailConfigService implements EmailConfigInterface {
  private emailHost: string;
  private emailPort: number;
  private emailSecure: boolean;
  private emailUser: string;
  private emailPassword: string;

  constructor() {
    this.emailHost = process.env.EMAIL_HOST ?? 'smtp.ukr.net';
    this.emailPort = Number(process.env.EMAIL_PORT ?? 465);
    this.emailSecure = Boolean(process.env.EMAIL_SECURE ?? true);
    this.emailUser = process.env.EMAIL_USER ?? '';
    this.emailPassword = process.env.EMAIL_PASSWORD ?? '';
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

  public getEmailUser(): string {
    return this.emailUser;
  }

  public getEmailPassword(): string {
    return this.emailPassword;
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

  public setEmailUser(user: string) {
    this.emailUser = user;
  }

  public setEmailPassword(password: string) {
    this.emailPassword = password;
  }
}

const mailConfigService = new MailConfigService();

export { mailConfigService };
