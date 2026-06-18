import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MqttModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
