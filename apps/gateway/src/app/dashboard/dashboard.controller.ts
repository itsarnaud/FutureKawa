import { Controller, Get, UseGuards } from '@nestjs/common';
import { CountryApiService, CountryCode } from '../country-api/country-api.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface LotSummary {
  status: 'conforme' | 'alerte' | 'perime';
  weightKg: number;
  warehouse: { id: string; name: string };
}

interface WarehouseSummary {
  id: string;
  name: string;
  country: { code: string; name: string };
}

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly countryApi: CountryApiService) {}

  @Get('stocks')
  async getStocks() {
    const codes: CountryCode[] = ['BR', 'EC', 'CO'];

    const perCountry = await Promise.all(
      codes.map(async (code) => {
        const [lots, warehouses] = await Promise.allSettled([
          this.countryApi.get<LotSummary[]>(code, 'lots'),
          this.countryApi.get<WarehouseSummary[]>(code, 'warehouses'),
        ]);

        const lotList = lots.status === 'fulfilled' ? lots.value : [];
        const warehouseList = warehouses.status === 'fulfilled' ? warehouses.value : [];

        const warehousesStock = warehouseList.map((warehouse) => {
          const warehouseLots = lotList.filter((lot) => lot.warehouse.id === warehouse.id);
          return {
            warehouseId: warehouse.id,
            warehouseName: warehouse.name,
            lotsCount: warehouseLots.length,
            totalWeightKg: warehouseLots.reduce((sum, lot) => sum + lot.weightKg, 0),
            byStatus: {
              conforme: warehouseLots.filter((l) => l.status === 'conforme').length,
              alerte: warehouseLots.filter((l) => l.status === 'alerte').length,
              perime: warehouseLots.filter((l) => l.status === 'perime').length,
            },
          };
        });

        return {
          country: code,
          available: lots.status === 'fulfilled' && warehouses.status === 'fulfilled',
          totalLots: lotList.length,
          totalWeightKg: lotList.reduce((sum, lot) => sum + lot.weightKg, 0),
          warehouses: warehousesStock,
        };
      }),
    );

    return { generatedAt: new Date().toISOString(), countries: perCountry };
  }
}
