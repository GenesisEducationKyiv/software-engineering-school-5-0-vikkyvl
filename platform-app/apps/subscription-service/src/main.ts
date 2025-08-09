import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import {
  notificationConfigService,
  subscriptionConfigService,
} from '../../../common/config';
import { ValidationPipe } from '@nestjs/common';
import { ErrorHandlerFilter } from './common';
import { LoggerProxy } from '../../../common/observability';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(LoggerProxy);
  logger.setServiceName(subscriptionConfigService.getServiceName());
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorHandlerFilter());

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [subscriptionConfigService.getBrokerUrl()],
        queue: subscriptionConfigService.getQueueName(),
        prefetchCount: 1,
        persistent: true,
        queueOptions: {
          durable: true,
          arguments: { 'x-message-ttl': subscriptionConfigService.getTTL() },
        },
      },
    },
    { inheritAppConfig: true },
  );

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [notificationConfigService.getBrokerUrl()],
        queue: notificationConfigService.getQueueName(),
        noAck: false,
        prefetchCount: 1,
        persistent: true,
        queueOptions: {
          durable: true,
          arguments: { 'x-message-ttl': notificationConfigService.getTTL() },
        },
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(subscriptionConfigService.getPort());
}
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
