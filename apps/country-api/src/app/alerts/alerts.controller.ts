import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '@fe/db';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll(@Query('warehouseId') warehouseId?: string, @Query('sent') sent?: string) {
    return this.prisma.alert.findMany({
      where: {
        ...(warehouseId && { warehouseId }),
        ...(sent !== undefined && { sent: sent === 'true' }),
      },
      orderBy: { triggeredAt: 'desc' },
      include: {
        warehouse: { select: { id: true, name: true } },
        lot: { select: { id: true, storedAt: true } },
      },
    });
  }
}
