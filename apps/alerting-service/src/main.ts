import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${process.env['MQTT_HOST'] || 'localhost'}:${process.env['MQTT_PORT'] || 1883}`,
    },
  });

  await app.listen();
  Logger.log('📡 Alerting service connected to MQTT broker');
}

bootstrap();
