import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  const port = process.env['GATEWAY_PORT'] || 3001;
  await app.listen(port);
  Logger.log(`Gateway running on: http://localhost:${port}/api`);
}

bootstrap();
