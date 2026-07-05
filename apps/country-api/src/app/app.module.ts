import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { LotsModule } from './lots/lots.module';
import { AlertsModule } from './alerts/alerts.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { CountryModule } from './country/country.module';
import { PrismaModule } from '@fe/db';

// Rate limiting (HttpThrottlerGuard) and the internal API key check
// (InternalApiKeyGuard) are implemented in ./common but intentionally not
// wired up below — not deployed anywhere yet, and both only add friction
// during dev/testing. Re-add them as APP_GUARD providers before any real
// deployment (see git history for the previous wiring).
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AlertsModule,
    MqttModule,
    LotsModule,
    WarehousesModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
