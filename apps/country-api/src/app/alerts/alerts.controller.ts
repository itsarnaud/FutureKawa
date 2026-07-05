import { Controller, Get, NotFoundException, Param, Patch, Query } from '@nestjs/common';
import { PrismaService } from '@fe/db';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll(
    @Query('warehouseId') warehouseId?: string,
    @Query('sent') sent?: string,
    @Query('resolved') resolved?: string,
  ) {
    return this.prisma.alert.findMany({
      where: {
        ...(warehouseId && { warehouseId }),
        ...(sent !== undefined && { sent: sent === 'true' }),
        ...(resolved !== undefined && { resolved: resolved === 'true' }),
      },
      orderBy: { triggeredAt: 'desc' },
      include: {
        warehouse: { select: { id: true, name: true, country: { select: { code: true, name: true } } } },
        lot: { select: { id: true, storedAt: true } },
      },
    });
  }

  @Patch(':id/resolve')
  async resolve(@Param('id') id: string) {
    const alert = await this.prisma.alert.findUnique({ where: { id } });
    if (!alert) throw new NotFoundException(`Alert ${id} not found`);

    return this.prisma.alert.update({
      where: { id },
      data: { resolved: true, resolvedAt: new Date() },
      include: {
        warehouse: { select: { id: true, name: true, country: { select: { code: true, name: true } } } },
        lot: { select: { id: true, storedAt: true } },
      },
    });
  }
}
