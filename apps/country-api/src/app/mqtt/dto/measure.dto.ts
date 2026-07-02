import { IsNumber, IsString } from 'class-validator';

export class MeasureDto {
  @IsNumber()
  temperature: number;

  @IsNumber()
  humidite: number;

  @IsString()
  timestamp: string;
}
