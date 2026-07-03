import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '@fe/db';
import { MeasureDto } from './dto/measure.dto';

interface WarehouseMeasure extends MeasureDto {
  country: string;
  warehouse: string;
}

@Injectable()
export class MeasuresService {
  private readonly logger = new Logger(MeasuresService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('ALERTING_CLIENT') private readonly alertingClient: ClientProxy,
  ) {}

  async record(measure: WarehouseMeasure): Promise<void> {
    const topic = `${measure.country}/${measure.warehouse}/mesures`;

    const device = await this.prisma.iotDevice.findUnique({
      where: { mqttTopic: topic },
    });

    if (!device) {
      this.logger.warn(`No IotDevice registered for topic: ${topic}`);
      throw new NotFoundException(`No device for topic ${topic}`);
    }

    await this.prisma.sensorReading.create({
      data: {
        deviceId: device.id,
        temperature: measure.temperature,
        humidity: measure.humidite,
        recordedAt: new Date(),
      },
    });

    this.alertingClient.emit('internal/reading-recorded', {
      warehouseId: device.warehouseId,
      temperature: measure.temperature,
      humidity: measure.humidite,
    });

    this.logger.log(
      `Recorded reading for device ${device.id} — temp: ${measure.temperature}°C, humidity: ${measure.humidite}%`,
    );
  }
}
