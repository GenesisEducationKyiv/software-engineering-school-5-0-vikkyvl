import { Errors } from '../interfaces';

export class MessageBrokerException implements Errors {
  public readonly message: string;
  public readonly status?: number;

  constructor(error: MessageBrokerException) {
    this.message = error.message;
    this.status = error.status;
  }
}
