import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CountryApiModule } from './country-api/country-api.module';
import { LotsController } from './lots/lots.controller';
import { WarehousesController } from './warehouses/warehouses.controller';
import { AlertsController } from './alerts/alerts.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CountryApiModule,
  ],
  controllers: [LotsController, WarehousesController, AlertsController],
})
export class AppModule {}
