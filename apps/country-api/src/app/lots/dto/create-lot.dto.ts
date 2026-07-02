import { IsString, IsNumber, IsPositive, IsOptional, IsDateString } from 'class-validator';

export class CreateLotDto {
  @IsString()
  warehouseId: string;

  @IsString()
  exploitationId: string;

  @IsNumber()
  @IsPositive()
  weightKg: number;

  @IsOptional()
  @IsDateString()
  storedAt?: string;
}
