import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { configService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.getBrokerUrl()],
        queue: configService.getQueueName(),
        queueOptions: { durable: false },
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(configService.getPort());
}
bootstrap();
