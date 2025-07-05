export interface ErrorHandlerInterface {
  handleError(error: unknown, defaultMessage: string): never;
}
