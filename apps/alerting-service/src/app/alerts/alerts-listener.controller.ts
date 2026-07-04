import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AlertsService } from './alerts.service';
import { ReadingRecordedDto } from './dto/reading-recorded.dto';

@Controller()
export class AlertsListenerController {
  constructor(private readonly alertsService: AlertsService) {}

  @EventPattern('internal/reading-recorded')
  async handleReadingRecorded(
    @Payload(new ValidationPipe({ transform: true })) reading: ReadingRecordedDto,
  ) {
    await this.alertsService.checkThresholds(reading.warehouseId, reading.temperature, reading.humidity);
  }
}
