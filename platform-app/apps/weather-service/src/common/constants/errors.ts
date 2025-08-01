import { GrpcCode } from '../../../../../common/shared';

export const weatherErrors = {
  INVALID_REQUEST: {
    status: 400,
    code: GrpcCode.INVALID_ARGUMENT,
    message: 'Invalid request.',
  },
  STATUS_404: { status: 404 },
  STATUS_400: { status: 400 },
  CITY_NOT_FOUND: {
    status: 404,
    code: GrpcCode.NOT_FOUND,
    message: 'City not found.',
  },
  INTERNAL_ERROR: {
    status: 500,
    code: GrpcCode.UNKNOWN,
    message: 'Internal error.',
  },
  PROVIDERS_NOT_AVAILABLE: {
    status: 500,
    code: GrpcCode.UNKNOWN,
    message: 'All weather API handlers failed to process the request.',
  },
};
