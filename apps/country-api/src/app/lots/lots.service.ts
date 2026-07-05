import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@fe/db';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotStatusDto } from './dto/update-lot-status.dto';
import { QueryLotsDto } from './dto/query-lots.dto';

@Injectable()
export class LotsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: QueryLotsDto) {
    return this.prisma.lot.findMany({
      where: {
        ...(query.warehouseId && { warehouseId: query.warehouseId }),
        ...(query.status && { status: query.status }),
      },
      orderBy: { storedAt: 'asc' },
      include: {
        warehouse: {
          select: { id: true, name: true, country: { select: { code: true, name: true } } },
        },
        exploitation: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
    const lot = await this.prisma.lot.findUnique({
      where: { id },
      include: {
        warehouse: { include: { country: true } },
        exploitation: true,
        alerts: { orderBy: { triggeredAt: 'desc' }, take: 10 },
      },
    });

    if (!lot) throw new NotFoundException(`Lot ${id} not found`);
    return lot;
  }

  create(dto: CreateLotDto) {
    return this.prisma.lot.create({
      data: {
        warehouseId: dto.warehouseId,
        exploitationId: dto.exploitationId,
        weightKg: dto.weightKg,
        ...(dto.storedAt && { storedAt: new Date(dto.storedAt) }),
      },
    });
  }

  async updateStatus(id: string, dto: UpdateLotStatusDto) {
    await this.findOne(id);
    return this.prisma.lot.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async findMeasures(id: string) {
    const lot = await this.findOne(id);

    return this.prisma.sensorReading.findMany({
      where: {
        device: { warehouseId: lot.warehouseId },
        recordedAt: { gte: lot.storedAt },
      },
      orderBy: { recordedAt: 'asc' },
      include: { device: { select: { id: true, mqttTopic: true } } },
    });
  }
}
