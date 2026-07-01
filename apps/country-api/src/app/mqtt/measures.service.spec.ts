import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MeasuresService } from './measures.service';
import { PrismaService } from '@fe/db';

const mockDevice = {
  id: 'device-1',
  warehouseId: 'wh-1',
  mqttTopic: 'BR/warehouse-1/mesures',
  status: 'actif',
};

const mockPrisma = {
  iotDevice: { findUnique: jest.fn() },
  sensorReading: { create: jest.fn() },
};

describe('MeasuresService', () => {
  let service: MeasuresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasuresService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MeasuresService>(MeasuresService);
    jest.clearAllMocks();
  });

  describe('record', () => {
    const measure = {
      country: 'BR',
      warehouse: 'warehouse-1',
      temperature: 29,
      humidite: 55,
      timestamp: '2026-07-01T10:00:00Z',
    };

    it('persiste la mesure quand le device existe', async () => {
      mockPrisma.iotDevice.findUnique.mockResolvedValue(mockDevice);
      mockPrisma.sensorReading.create.mockResolvedValue({});

      await service.record(measure);

      expect(mockPrisma.iotDevice.findUnique).toHaveBeenCalledWith({
        where: { mqttTopic: 'BR/warehouse-1/mesures' },
      });
      expect(mockPrisma.sensorReading.create).toHaveBeenCalledWith({
        data: {
          deviceId: 'device-1',
          temperature: 29,
          humidity: 55,
          recordedAt: new Date('2026-07-01T10:00:00Z'),
        },
      });
    });

    it('lève une NotFoundException si aucun device pour le topic', async () => {
      mockPrisma.iotDevice.findUnique.mockResolvedValue(null);

      await expect(service.record(measure)).rejects.toThrow(NotFoundException);
      expect(mockPrisma.sensorReading.create).not.toHaveBeenCalled();
    });

    it('construit le topic à partir de country et warehouse', async () => {
      mockPrisma.iotDevice.findUnique.mockResolvedValue(mockDevice);
      mockPrisma.sensorReading.create.mockResolvedValue({});

      await service.record({ ...measure, country: 'EC', warehouse: 'hub-2' });

      expect(mockPrisma.iotDevice.findUnique).toHaveBeenCalledWith({
        where: { mqttTopic: 'EC/hub-2/mesures' },
      });
    });
  });
});
