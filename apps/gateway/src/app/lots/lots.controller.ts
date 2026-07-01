import { Controller, Get, Query } from '@nestjs/common';
import { CountryApiService } from '../country-api/country-api.service';

@Controller('lots')
export class LotsController {
  constructor(private readonly countryApi: CountryApiService) {}

  @Get()
  findAll(@Query('warehouseId') warehouseId?: string, @Query('status') status?: string) {
    const params = new URLSearchParams();
    if (warehouseId) params.set('warehouseId', warehouseId);
    if (status) params.set('status', status);

    const query = params.toString();
    return this.countryApi.get(`lots${query ? `?${query}` : ''}`);
  }
}
