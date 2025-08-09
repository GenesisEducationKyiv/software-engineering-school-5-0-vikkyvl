export const COMMON_LABELS = ['method', 'endpoint', 'status'];
export const COMMON_BUCKETS = [0.1, 0.3, 0.5, 1, 3, 5, 10, 30, Infinity];

export const METRIC_DESCRIPTION = {
  NAME: {
    HTTP_REQUEST_TOTAL: 'http_request_total',
    HTTP_ERROR_TOTAL: 'http_error_total',
    HTTP_DURATION_SECONDS: 'http_duration_seconds',
  },
  HELP: {
    HTTP_REQUEST_TOTAL: 'Total number of HTTP requests',
    HTTP_ERROR_TOTAL: 'Total number of HTTP errors',
    HTTP_DURATION_SECONDS: 'Duration of HTTP requests in seconds',
  },
};
