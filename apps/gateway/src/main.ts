import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Wide open: no deployment yet, and the frontend/gateway routinely end up
  // on different domains in dev (Codespaces port-forwarding, etc.). Tighten
  // this (origin allowlist + helmet) before any real deployment.
  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FutureKawa — Gateway (siège)')
    .setDescription(
      "API centrale consolidant les backends pays (lots, entrepôts, alertes, stocks). N'exécute pas de règles métier : elle agrège les résultats des API pays.",
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env['GATEWAY_PORT'] || 3001;
  await app.listen(port);
  Logger.log(`Gateway running on: http://localhost:${port}/api`);
  Logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
