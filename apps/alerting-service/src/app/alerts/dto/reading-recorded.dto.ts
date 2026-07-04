import { IsNumber, IsString } from 'class-validator';

export class ReadingRecordedDto {
  @IsString()
  warehouseId!: string;

  @IsNumber()
  temperature!: number;

  @IsNumber()
  humidity!: number;
}
