export interface Errors {
  status?: number;
  statusCode?: number;
  message: string;
  response?: {
    message: string;
  };
}
