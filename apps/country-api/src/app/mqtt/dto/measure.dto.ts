import { IsDateString, IsNumber } from 'class-validator';

export class MeasureDto {
  @IsNumber()
  temperature: number;

  @IsNumber()
  humidite: number;

  @IsDateString()
  timestamp: string;
}
