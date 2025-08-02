import { ConsoleLogger } from '@nestjs/common';

export class LoggerService extends ConsoleLogger implements LoggerService {
  constructor(context: string) {
    super();
    this.setLogLevels(['log', 'warn', 'error', 'debug']);
    this.setContext(context);
  }

  log(message: string): void {
    super.log(message);
  }

  warn(message: string): void {
    super.warn(message);
  }

  error(message: string, trace?: string): void {
    super.error(message, trace);
  }

  debug(message: string): void {
    super.debug(message);
  }
}
