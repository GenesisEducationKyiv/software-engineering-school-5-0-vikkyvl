import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiConfigService } from '../../../common/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  app.enableCors({ origin: apiConfigService.getReactAppApiUrl() });

  await app.listen(apiConfigService.getPort());
}
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
