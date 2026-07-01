import { Controller, Get, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { CountryApiService } from '../country-api/country-api.service';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly countryApi: CountryApiService) {}

  @Get()
  findAll() {
    return this.countryApi.get('warehouses');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countryApi.get(`warehouses/${id}`);
  }

  @Get(':id/readings')
  findReadings(
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('since') since?: string,
  ) {
    const params = new URLSearchParams({ limit: String(limit) });
    if (since) params.set('since', since);
    return this.countryApi.get(`warehouses/${id}/readings?${params.toString()}`);
  }
}
