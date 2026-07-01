import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { LotsModule } from './lots/lots.module';
import { PrismaModule } from '@fe/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MqttModule,
    LotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
