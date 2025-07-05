export const weatherErrors = {
  INVALID_REQUEST: {
    status: 400,
    message: 'Invalid request.',
  },
  STATUS_404: { status: 404 },
  STATUS_400: { status: 400 },
  CITY_NOT_FOUND: {
    status: 404,
    message: 'City not found.',
  },
  INTERNAL_ERROR: {
    status: 500,
    message: 'Internal error.',
  },
};
