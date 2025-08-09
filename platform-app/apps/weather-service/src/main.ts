import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { weatherConfigService } from '../../../common/config';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { LoggerProxy } from '../../../common/observability';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(LoggerProxy);
  logger.setServiceName(weatherConfigService.getServiceName());
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice(
    {
      transport: Transport.GRPC,
      options: {
        url: weatherConfigService.getGrpcUrl(),
        package: weatherConfigService.getPackageName(),
        protoPath: join(process.cwd(), 'common/proto/weather/weather.proto'),
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(weatherConfigService.getPort());
}
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
