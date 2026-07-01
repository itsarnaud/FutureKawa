import { Test, TestingModule } from '@nestjs/testing';
import { MqttContext } from '@nestjs/microservices';
import { MqttController } from './mqtt.controller';
import { MeasuresService } from './measures.service';

const mockMeasuresService = {
  record: jest.fn(),
};

const mockMqttContext = (topic: string): MqttContext =>
  ({ getTopic: () => topic }) as unknown as MqttContext;

describe('MqttController', () => {
  let controller: MqttController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MqttController],
      providers: [{ provide: MeasuresService, useValue: mockMeasuresService }],
    }).compile();

    controller = module.get<MqttController>(MqttController);
    jest.clearAllMocks();
  });

  describe('handleMeasure', () => {
    const payload = {
      temperature: 29,
      humidite: 55,
      timestamp: '2026-07-01T10:00:00Z',
    };

    it('extrait country et warehouse du topic et appelle record', async () => {
      mockMeasuresService.record.mockResolvedValue(undefined);

      await controller.handleMeasure(payload, mockMqttContext('BR/warehouse-1/mesures'));

      expect(mockMeasuresService.record).toHaveBeenCalledWith({
        country: 'BR',
        warehouse: 'warehouse-1',
        ...payload,
      });
    });

    it('fonctionne avec différents pays et entrepôts', async () => {
      mockMeasuresService.record.mockResolvedValue(undefined);

      await controller.handleMeasure(payload, mockMqttContext('CO/hub-bogota/mesures'));

      expect(mockMeasuresService.record).toHaveBeenCalledWith({
        country: 'CO',
        warehouse: 'hub-bogota',
        ...payload,
      });
    });
  });
});
