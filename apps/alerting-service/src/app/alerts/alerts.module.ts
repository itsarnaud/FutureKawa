import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsListenerController } from './alerts-listener.controller';

@Module({
  controllers: [AlertsListenerController],
  providers: [AlertsService],
})
export class AlertsModule {}
