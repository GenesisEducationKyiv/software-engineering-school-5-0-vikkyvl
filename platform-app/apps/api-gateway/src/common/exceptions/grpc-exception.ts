import { Errors } from '../interfaces';

export class GrpcException implements Errors {
  public readonly message: string;
  public readonly code?: number;
  public readonly details?: string;

  constructor(error: GrpcException) {
    this.message = error.message;
    this.code = error.code;
    this.details = error.details;
  }
}
