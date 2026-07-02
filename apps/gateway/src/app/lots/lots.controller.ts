import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { CountryApiService } from '../country-api/country-api.service';

@Controller('lots')
export class LotsController {
  constructor(private readonly countryApi: CountryApiService) {}

  @Get()
  findAll(
    @Query('country') country?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('status') status?: string,
  ) {
    const params = new URLSearchParams();
    if (warehouseId) params.set('warehouseId', warehouseId);
    if (status) params.set('status', status);
    const path = `lots${params.toString() ? `?${params.toString()}` : ''}`;

    if (country) {
      if (!this.countryApi.isValidCountry(country)) throw new BadRequestException(`Invalid country code: ${country}`);
      return this.countryApi.get(country, path);
    }

    return this.countryApi.getAll(path);
  }
}
