export interface EmailConfigInterface {
  getEmailHost(): string;
  getEmailPort(): number | string;
  getEmailUser(): string | undefined;
  getEmailPassword(): string | undefined;
}
