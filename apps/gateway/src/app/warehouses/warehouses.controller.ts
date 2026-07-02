import { Controller, Get, Param, Query, ParseIntPipe, DefaultValuePipe, BadRequestException } from '@nestjs/common';
import { CountryApiService } from '../country-api/country-api.service';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly countryApi: CountryApiService) {}

  @Get()
  findAll(@Query('country') country?: string) {
    if (country) {
      if (!this.countryApi.isValidCountry(country)) throw new BadRequestException(`Invalid country code: ${country}`);
      return this.countryApi.get(country, 'warehouses');
    }
    return this.countryApi.getAll('warehouses');
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('country') country: string) {
    if (!this.countryApi.isValidCountry(country)) throw new BadRequestException(`Invalid country code: ${country}`);
    return this.countryApi.get(country, `warehouses/${id}`);
  }

  @Get(':id/readings')
  findReadings(
    @Param('id') id: string,
    @Query('country') country: string,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('since') since?: string,
  ) {
    if (!this.countryApi.isValidCountry(country)) throw new BadRequestException(`Invalid country code: ${country}`);
    const params = new URLSearchParams({ limit: String(limit) });
    if (since) params.set('since', since);
    return this.countryApi.get(country, `warehouses/${id}/readings?${params.toString()}`);
  }
}
