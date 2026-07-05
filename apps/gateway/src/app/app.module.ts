import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@fe/db';
import { CountryApiModule } from './country-api/country-api.module';
import { AuthModule } from './auth/auth.module';
import { LotsController } from './lots/lots.controller';
import { WarehousesController } from './warehouses/warehouses.controller';
import { AlertsController } from './alerts/alerts.controller';
import { PaysController } from './pays/pays.controller';
import { DashboardController } from './dashboard/dashboard.controller';

// No rate limiting for now — not deployed anywhere yet, and it only gets in
// the way of dev/testing (rapid manual retries, the IoT simulator, e2e runs).
// Re-add a ThrottlerModule + APP_GUARD before any real deployment.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CountryApiModule,
  ],
  controllers: [
    LotsController,
    WarehousesController,
    AlertsController,
    PaysController,
    DashboardController,
  ],
})
export class AppModule {}
