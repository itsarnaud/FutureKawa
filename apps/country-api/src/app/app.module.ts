import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { LotsModule } from './lots/lots.module';
import { AlertsModule } from './alerts/alerts.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { PrismaModule } from '@fe/db';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AlertsModule,
    MqttModule,
    LotsModule,
    WarehousesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
