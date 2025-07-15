import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { weatherConfigService } from '../../../common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [weatherConfigService.getBrokerUrl()],
        queue: weatherConfigService.getQueueName(),
        queueOptions: { durable: false },
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
