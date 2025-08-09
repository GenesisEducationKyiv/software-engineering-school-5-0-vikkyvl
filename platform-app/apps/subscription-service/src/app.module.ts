import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { LoggerModule } from '../../../common/observability/logger/logger.module';

@Module({
  imports: [ModulesModule, LoggerModule],
})
export class AppModule {}
