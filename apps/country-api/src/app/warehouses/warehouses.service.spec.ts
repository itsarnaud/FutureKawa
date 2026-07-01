import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { PrismaService } from '@fe/db';

const mockWarehouse = {
  id: 'wh-1',
  name: 'Hub São Paulo',
  managerEmail: 'manager@futurekawa.com',
  country: { id: 'c-1', code: 'BR', name: 'Brésil' },
  devices: [],
};

const mockReading = {
  id: 'r-1',
  deviceId: 'dev-1',
  temperature: 29,
  humidity: 55,
  recordedAt: new Date(),
  device: { id: 'dev-1', mqttTopic: 'bresil/entrepot1/mesures' },
};

const mockPrisma = {
  warehouse: { findMany: jest.fn(), findUnique: jest.fn() },
  sensorReading: { findMany: jest.fn() },
};

describe('WarehousesService', () => {
  let service: WarehousesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehousesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retourne tous les entrepôts avec leur pays', async () => {
      mockPrisma.warehouse.findMany.mockResolvedValue([mockWarehouse]);

      const result = await service.findAll();

      expect(mockPrisma.warehouse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ include: { country: true } }),
      );
      expect(result).toEqual([mockWarehouse]);
    });
  });

  describe('findOne', () => {
    it('retourne l\'entrepôt avec son pays et ses devices', async () => {
      mockPrisma.warehouse.findUnique.mockResolvedValue(mockWarehouse);

      const result = await service.findOne('wh-1');

      expect(result).toEqual(mockWarehouse);
    });

    it('lève une NotFoundException si entrepôt inexistant', async () => {
      mockPrisma.warehouse.findUnique.mockResolvedValue(null);

      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findReadings', () => {
    it('retourne les mesures triées par date desc avec la limite', async () => {
      mockPrisma.warehouse.findUnique.mockResolvedValue(mockWarehouse);
      mockPrisma.sensorReading.findMany.mockResolvedValue([mockReading]);

      const result = await service.findReadings('wh-1', 50);

      expect(mockPrisma.sensorReading.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { device: { warehouseId: 'wh-1' } },
          orderBy: { recordedAt: 'desc' },
          take: 50,
        }),
      );
      expect(result).toEqual([mockReading]);
    });

    it('lève une NotFoundException si entrepôt inexistant', async () => {
      mockPrisma.warehouse.findUnique.mockResolvedValue(null);

      await expect(service.findReadings('unknown')).rejects.toThrow(NotFoundException);
    });
  });
});
