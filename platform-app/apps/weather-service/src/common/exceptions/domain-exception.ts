export abstract class DomainException extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  abstract getCode(): number;
  abstract getStatus(): number;
  abstract getMessage(): string;
}
