import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import {
  notificationConfigService,
  subscriptionConfigService,
} from '../../../common/config';
import { ValidationPipe } from '@nestjs/common';
import { ErrorHandlerFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorHandlerFilter());

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [subscriptionConfigService.getBrokerUrl()],
        queue: subscriptionConfigService.getQueueName(),
        queueOptions: { durable: false },
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
        queueOptions: { durable: false },
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
