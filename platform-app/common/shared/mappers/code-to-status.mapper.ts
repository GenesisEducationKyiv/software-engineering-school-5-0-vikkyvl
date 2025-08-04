import { GrpcCode } from '../enums/code.enum';

const grpcToHttpMap = {
  [GrpcCode.OK]: 200,
  [GrpcCode.UNKNOWN]: 500,
  [GrpcCode.INVALID_ARGUMENT]: 400,
  [GrpcCode.NOT_FOUND]: 404,
  [GrpcCode.ABORTED]: 409,
  [GrpcCode.UNAVAILABLE]: 500,
};

export function mapGrpcToHttp(grpcCode: GrpcCode): number {
  return grpcToHttpMap[grpcCode] ?? 500;
}
