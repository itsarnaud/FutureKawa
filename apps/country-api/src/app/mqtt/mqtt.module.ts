import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MqttController } from './mqtt.controller';
import { MeasuresService } from './measures.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'ALERTING_CLIENT',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.MQTT,
          options: {
            url: `mqtt://${config.get<string>('MQTT_HOST', 'localhost')}:${config.get<number>('MQTT_PORT', 1883)}`,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [MqttController],
  providers: [MeasuresService],
  exports: [MeasuresService],
})
export class MqttModule {}
