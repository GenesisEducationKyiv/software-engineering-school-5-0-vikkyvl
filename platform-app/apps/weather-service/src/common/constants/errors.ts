import { ErrorsCode } from '../../../../../common/shared';

export const weatherErrors = {
  INVALID_REQUEST: {
    code: ErrorsCode.INVALID_ARGUMENT,
    status: 400,
    message: 'Invalid request.',
  },
  STATUS_404: { status: 404 },
  STATUS_400: { status: 400 },
  CITY_NOT_FOUND: {
    code: ErrorsCode.NOT_FOUND,
    status: 404,
    message: 'City not found.',
  },
  INTERNAL_ERROR: {
    code: ErrorsCode.UNKNOWN,
    status: 500,
    message: 'Internal error.',
  },
  PROVIDERS_NOT_AVAILABLE: {
    code: ErrorsCode.UNKNOWN,
    status: 500,
    message: 'All weather API handlers failed to process the request.',
  },
};
