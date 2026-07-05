import { Controller, Get, Param, Patch, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { CountryApiService } from '../country-api/country-api.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly countryApi: CountryApiService) {}

  @Get()
  findAll(
    @Query('country') country?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('sent') sent?: string,
    @Query('resolved') resolved?: string,
  ) {
    const params = new URLSearchParams();
    if (warehouseId) params.set('warehouseId', warehouseId);
    if (sent !== undefined) params.set('sent', sent);
    if (resolved !== undefined) params.set('resolved', resolved);
    const path = `alerts${params.toString() ? `?${params.toString()}` : ''}`;

    if (country) {
      if (!this.countryApi.isValidCountry(country)) throw new BadRequestException(`Invalid country code: ${country}`);
      return this.countryApi.get(country, path);
    }

    return this.countryApi.getAll(path);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string, @Query('country') country: string) {
    if (!this.countryApi.isValidCountry(country)) throw new BadRequestException(`Invalid country code: ${country}`);
    return this.countryApi.patch(country, `alerts/${id}/resolve`);
  }
}
