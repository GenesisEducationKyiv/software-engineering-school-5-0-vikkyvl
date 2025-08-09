import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiConfigService } from '../../../common/config';
import { ValidationPipe } from '@nestjs/common';
import { LoggerProxy } from '../../../common/observability';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(LoggerProxy);
  logger.setServiceName(apiConfigService.getServiceName());
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api', { exclude: ['/metrics'] });
  app.enableCors({ origin: apiConfigService.getReactAppApiUrl() });

  await app.listen(apiConfigService.getPort());
}
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
