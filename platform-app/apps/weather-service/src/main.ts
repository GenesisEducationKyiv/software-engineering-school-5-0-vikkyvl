import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { weatherConfigService } from '../../../common/config';
import { ErrorHandlerFilter } from './common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ErrorHandlerFilter());

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
