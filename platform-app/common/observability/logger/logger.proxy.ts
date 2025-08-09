import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { observabilityConfigService } from '../../config';
import { LoggerInterface } from './interface';
import { loggerToken } from '../../shared/constants/tokens';

const LOG_TO_CONSOLE = observabilityConfigService.getLogToConsole();

@Injectable()
export class LoggerProxy extends ConsoleLogger {
  @Inject(loggerToken.LOGGER_INTERFACE)
  private readonly loggerService: LoggerInterface;

  constructor() {
    super({
      json: true,
    });
  }

  public setServiceName(serviceName: string) {
    this.loggerService.setServiceName(serviceName);
  }

  public setContext(context: string) {
    super.setContext(context);
  }

  public log(message: string, context?: string) {
    const ctx = context ?? this.context;

    if (LOG_TO_CONSOLE) {
      super.log(message, ctx);
    }

    this.loggerService.log(message, ctx);
  }

  public warn(message: string, context?: string) {
    const ctx = context ?? this.context;

    if (LOG_TO_CONSOLE) {
      super.warn(message, ctx);
    }

    this.loggerService.warn(message, ctx);
  }

  public error(message: string, stack?: string, context?: string) {
    const ctx = context ?? this.context;

    if (LOG_TO_CONSOLE) {
      super.error(message, stack, ctx);
    }

    this.loggerService.error(message, stack, ctx);
  }

  public debug(message: string, context?: string) {
    const ctx = context ?? this.context;

    if (LOG_TO_CONSOLE) {
      super.debug(message, ctx);
    }

    this.loggerService.debug(message, ctx);
  }
}
