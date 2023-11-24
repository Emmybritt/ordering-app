import { NestFactory } from '@nestjs/core';
import { BilingModule } from './biling.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BilingModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('BILING'));
  await app.startAllMicroservices();
}
bootstrap();
