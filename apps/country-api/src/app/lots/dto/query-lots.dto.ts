import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LotStatus } from '@prisma/client';

export class QueryLotsDto {
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @IsOptional()
  @IsEnum(LotStatus)
  status?: LotStatus;
}
