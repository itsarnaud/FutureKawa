import { IsEnum } from 'class-validator';
import { LotStatus } from '@prisma/client';

export class UpdateLotStatusDto {
  @IsEnum(LotStatus)
  status: LotStatus;
}
