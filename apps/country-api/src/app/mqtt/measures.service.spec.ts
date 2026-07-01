import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MeasuresService } from './measures.service';
import { AlertsService } from '../alerts/alerts.service';
import { PrismaService } from '@fe/db';

const mockDevice = {
  id: 'device-1',
  warehouseId: 'wh-1',
  mqttTopic: 'bresil/entrepot1/mesures',
  status: 'actif',
};

const mockPrisma = {
  iotDevice: { findUnique: jest.fn() },
  sensorReading: { create: jest.fn() },
};

const mockAlertsService = { checkThresholds: jest.fn() };

describe('MeasuresService', () => {
  let service: MeasuresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasuresService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AlertsService, useValue: mockAlertsService },
      ],
    }).compile();

    service = module.get<MeasuresService>(MeasuresService);
    jest.clearAllMocks();
  });

  describe('record', () => {
    const measure = {
      country: 'bresil',
      warehouse: 'entrepot1',
      temperature: 29,
      humidite: 55,
      timestamp: '123456',
    };

    it('persiste la mesure avec recordedAt = now quand le device existe', async () => {
      mockPrisma.iotDevice.findUnique.mockResolvedValue(mockDevice);
      mockPrisma.sensorReading.create.mockResolvedValue({});

      const before = new Date();
      await service.record(measure);
      const after = new Date();

      expect(mockPrisma.iotDevice.findUnique).toHaveBeenCalledWith({
        where: { mqttTopic: 'bresil/entrepot1/mesures' },
      });

      const { recordedAt, ...rest } = mockPrisma.sensorReading.create.mock.calls[0][0].data;
      expect(rest).toEqual({ deviceId: 'device-1', temperature: 29, humidity: 55 });
      expect(recordedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(recordedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('lève une NotFoundException si aucun device pour le topic', async () => {
      mockPrisma.iotDevice.findUnique.mockResolvedValue(null);

      await expect(service.record(measure)).rejects.toThrow(NotFoundException);
      expect(mockPrisma.sensorReading.create).not.toHaveBeenCalled();
    });

    it('construit le topic à partir de country et warehouse', async () => {
      mockPrisma.iotDevice.findUnique.mockResolvedValue(mockDevice);
      mockPrisma.sensorReading.create.mockResolvedValue({});

      await service.record({ ...measure, country: 'colombie', warehouse: 'entrepot2' });

      expect(mockPrisma.iotDevice.findUnique).toHaveBeenCalledWith({
        where: { mqttTopic: 'colombie/entrepot2/mesures' },
      });
    });
  });
});
