import { Module } from '@nestjs/common';
import { loggerToken } from '../../shared/constants/tokens';
import { LokiLoggerService } from './loki-logger.service';
import { LoggerProxy } from './logger.proxy';

@Module({
  providers: [
    LoggerProxy,
    {
      provide: loggerToken.LOGGER_INTERFACE,
      useClass: LokiLoggerService,
    },
  ],
  exports: [LoggerProxy],
})
export class LoggerModule {}
