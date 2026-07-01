import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@fe/db';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.warehouse.findMany({
      include: { country: true },
    });
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: { country: true, devices: true },
    });

    if (!warehouse) throw new NotFoundException(`Warehouse ${id} not found`);
    return warehouse;
  }

  async findReadings(id: string, limit = 100) {
    await this.findOne(id);

    return this.prisma.sensorReading.findMany({
      where: { device: { warehouseId: id } },
      orderBy: { recordedAt: 'desc' },
      take: limit,
      include: { device: { select: { id: true, mqttTopic: true } } },
    });
  }
}
