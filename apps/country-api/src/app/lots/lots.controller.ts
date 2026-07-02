import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotStatusDto } from './dto/update-lot-status.dto';
import { QueryLotsDto } from './dto/query-lots.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  findAll(@Query(new ValidationPipe({ transform: true })) query: QueryLotsDto) {
    return this.lotsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(id);
  }

  @Post()
  create(@Body(new ValidationPipe()) dto: CreateLotDto) {
    return this.lotsService.create(dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: UpdateLotStatusDto,
  ) {
    return this.lotsService.updateStatus(id, dto);
  }
}
