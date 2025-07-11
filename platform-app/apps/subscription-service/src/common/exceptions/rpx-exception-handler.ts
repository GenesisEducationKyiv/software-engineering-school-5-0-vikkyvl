import { RpcException } from '@nestjs/microservices';

export abstract class RpxExceptionHandler extends RpcException {
  protected constructor(response: object) {
    super(response);
  }
}
