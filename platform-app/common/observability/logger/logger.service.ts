import { ConsoleLogger, Injectable } from '@nestjs/common';
import { observabilityConfigService } from '../../config';
import axios, { AxiosError } from 'axios';
import { LogLevel } from '../../shared';
import { LoggerInterface } from './interface';

const MILLISECOND_TO_NANOSECOND = 1000000;
const LOG_TO_CONSOLE = observabilityConfigService.getLogToConsole();

@Injectable()
export class LoggerService extends ConsoleLogger implements LoggerInterface {
  private lokiUrl: string = observabilityConfigService.getLokiUrl();

  constructor(private readonly serviceName: string) {
    super({
      json: true,
    });
  }

  public setContext(context: string) {
    super.setContext(context);
  }

  public log(message: string, context?: string) {
    const ctx = context ?? this.context;

    if (LOG_TO_CONSOLE) {
      super.log(message, ctx);
    }

    if (this.shouldSampleLog()) {
      this.sendToObservabilityService(message, LogLevel.INFO, ctx);
    }
  }

  public warn(message: string, context?: string) {
    const ctx = context ?? this.context;

    if (LOG_TO_CONSOLE) {
      super.warn(message, ctx);
    }

    this.sendToObservabilityService(message, LogLevel.WARN, ctx);
  }

  public error(message: string, stack?: string, context?: string) {
    const ctx = context ?? this.context;

    if (LOG_TO_CONSOLE) {
      super.error(message, stack, ctx);
    }

    this.sendToObservabilityService(message, LogLevel.ERROR, ctx, stack);
  }

  public debug(message: string, context?: string) {
    const ctx = context ?? this.context;

    if (LOG_TO_CONSOLE) {
      super.debug(message, ctx);
    }

    this.sendToObservabilityService(message, LogLevel.DEBUG, ctx);
  }

  private shouldSampleLog(): boolean {
    const hour = new Date().getHours();

    const isWorkingHours =
      hour >= observabilityConfigService.getLogWorkHourStart() &&
      hour < observabilityConfigService.getLogWorkHourEnd();

    const sampleRate = isWorkingHours
      ? observabilityConfigService.getLogSampleRateWork()
      : observabilityConfigService.getLogSampleRateNonWork();

    return Math.random() < sampleRate;
  }

  private sendToObservabilityService(
    message: string,
    level?: LogLevel,
    context?: string,
    stack?: string,
  ): void {
    const logData = {
      level,
      pid: process.pid,
      service: this.serviceName,
      timestamp: new Date().toISOString(),
      context: context,
      stack: stack,
      message,
    };

    const logPayload = {
      streams: [
        {
          stream: {
            level,
            service: this.serviceName,
            context: context,
            stack: stack,
          },
          values: [
            [
              (Date.now() * MILLISECOND_TO_NANOSECOND).toString(),
              JSON.stringify(logData),
            ],
          ],
        },
      ],
    };

    axios
      .post(`${this.lokiUrl}/loki/api/v1/push`, logPayload, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then()
      .catch((err: unknown) => {
        const error = err as AxiosError;
        console.error(
          'Failed to send log to observability service:',
          error.message,
          error?.response?.data,
        );
      });
  }
}
