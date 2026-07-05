import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@fe/db';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  async getInfo() {
    const country = await this.prisma.country.findFirst({
      include: { exploitations: true, warehouses: { select: { id: true, name: true } } },
    });
    if (!country) throw new NotFoundException('No country configured for this instance');
    return country;
  }
}
