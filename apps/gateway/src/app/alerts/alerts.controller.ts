import { Controller, Get, Query } from '@nestjs/common';
import { CountryApiService } from '../country-api/country-api.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly countryApi: CountryApiService) {}

  @Get()
  findAll(@Query('warehouseId') warehouseId?: string, @Query('sent') sent?: string) {
    const params = new URLSearchParams();
    if (warehouseId) params.set('warehouseId', warehouseId);
    if (sent !== undefined) params.set('sent', sent);

    const query = params.toString();
    return this.countryApi.get(`alerts${query ? `?${query}` : ''}`);
  }
}
