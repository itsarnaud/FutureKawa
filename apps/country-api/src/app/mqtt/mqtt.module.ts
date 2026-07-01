import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttController } from './mqtt.controller';
import { MeasuresService } from './measures.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [ConfigModule, AlertsModule],
  controllers: [MqttController],
  providers: [MeasuresService],
  exports: [MeasuresService],
})
export class MqttModule {}
