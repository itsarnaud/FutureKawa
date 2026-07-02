import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CountryApiService } from './country-api.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [CountryApiService],
  exports: [CountryApiService],
})
export class CountryApiModule {}
