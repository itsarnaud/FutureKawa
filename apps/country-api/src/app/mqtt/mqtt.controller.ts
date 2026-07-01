import { Controller, ValidationPipe } from '@nestjs/common';
import { Ctx, EventPattern, MqttContext, Payload } from '@nestjs/microservices';
import { MeasureDto } from './dto/measure.dto';
import { MeasuresService } from './measures.service';

@Controller()
export class MqttController {
  constructor(private readonly measuresService: MeasuresService) {}

  @EventPattern('+/+/mesures')
  async handleMeasure(
    @Payload(new ValidationPipe({ transform: true })) measure: MeasureDto,
    @Ctx() context: MqttContext,
  ) {
    const [country, warehouse] = context.getTopic().split('/');
    await this.measuresService.record({ country, warehouse, ...measure });
  }
}
