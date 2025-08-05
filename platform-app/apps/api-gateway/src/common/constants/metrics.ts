export const COMMON_LABELS = ['method', 'endpoint', 'status'];
export const COMMON_BUCKETS = [0.1, 0.3, 0.5, 1, 3, 5];

export const METRIC_LABELS = {
  ENDPOINT: {
    WEATHER: '/api/weather',
    SUBSCRIPTION: '/api/subscription',
    CONFIRM: '/api/confirm',
    UNSUBSCRIBE: '/api/unsubscribe',
  },
};

export const METRIC_DESCRIPTION = {
  NAME: {
    WEATHER_REQUEST_TOTAL: 'weather_requests_total',
    WEATHER_ERROR_TOTAL: 'weather_errors_total',
    WEATHER_DURATION_SECONDS: 'weather_duration_seconds',
    SUBSCRIPTION_REQUEST_TOTAL: 'subscription_requests_total',
    SUBSCRIPTION_ERROR_TOTAL: 'subscription_errors_total',
    SUBSCRIPTION_DURATION_SECONDS: 'subscription_duration_seconds',
  },
  HELP: {
    WEATHER_REQUEST_TOTAL: 'Total number of weather requests',
    WEATHER_ERROR_TOTAL: 'Total number of weather errors',
    WEATHER_DURATION_SECONDS: 'Duration of weather requests in seconds',
    SUBSCRIPTION_REQUEST_TOTAL: 'Total number of subscription requests',
    SUBSCRIPTION_ERROR_TOTAL: 'Total number of subscription errors',
    SUBSCRIPTION_DURATION_SECONDS:
      'Duration of subscription requests in seconds',
  },
};
