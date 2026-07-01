import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttController } from './mqtt.controller';
import { MeasuresService } from './measures.service';

@Module({
  imports: [ConfigModule],
  controllers: [MqttController],
  providers: [MeasuresService],
  exports: [MeasuresService],
})
export class MqttModule {}
