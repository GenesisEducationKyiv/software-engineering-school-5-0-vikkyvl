import { LoggerInterface } from './interface';
import { observabilityConfigService } from '../../config';
import { LogLevel } from '../../shared';
import axios, { AxiosError } from 'axios';

const MILLISECOND_TO_NANOSECOND = 1000000;

export class LokiLoggerService implements LoggerInterface {
  private lokiUrl: string = observabilityConfigService.getLokiUrl();
  private serviceName: string;

  constructor() {}

  setServiceName(serviceName: string): void {
    this.serviceName = serviceName;
  }

  log(message: string, ctx?: string): void {
    if (this.shouldSampleLog()) {
      this.sendToObservabilityService(message, LogLevel.INFO, ctx);
    }
  }

  warn(message: string, ctx?: string): void {
    this.sendToObservabilityService(message, LogLevel.WARN, ctx);
  }

  error(message: string, stack?: string, ctx?: string): void {
    this.sendToObservabilityService(message, LogLevel.ERROR, ctx, stack);
  }

  debug(message: string, ctx?: string): void {
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
