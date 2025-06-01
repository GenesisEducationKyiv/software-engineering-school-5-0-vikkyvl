import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {configService} from "./config/config.service";

const pack = require('../package.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getBrockerUri()],
      queue: pack.queue,
      queueOptions: { durable: false },
    },
  });

  await app.listen(configService.getPort());
}
bootstrap();
