import { Controller, Get, UseGuards } from '@nestjs/common';
import { CountryApiService } from '../country-api/country-api.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pays')
export class PaysController {
  constructor(private readonly countryApi: CountryApiService) {}

  @Get()
  findAll() {
    return this.countryApi.getAll('country');
  }
}
