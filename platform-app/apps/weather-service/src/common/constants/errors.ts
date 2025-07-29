import { GrpcCode } from '../../../../../common/shared';

export const weatherErrors = {
  INVALID_REQUEST: {
    code: GrpcCode.INVALID_ARGUMENT,
    message: 'Invalid request.',
  },
  STATUS_404: { status: 404 },
  STATUS_400: { status: 400 },
  CITY_NOT_FOUND: {
    code: GrpcCode.NOT_FOUND,
    message: 'City not found.',
  },
  INTERNAL_ERROR: {
    code: GrpcCode.UNKNOWN,
    message: 'Internal error.',
  },
  PROVIDERS_NOT_AVAILABLE: {
    code: GrpcCode.UNKNOWN,
    message: 'All weather API handlers failed to process the request.',
  },
};
