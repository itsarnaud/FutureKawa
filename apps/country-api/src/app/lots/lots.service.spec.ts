import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LotStatus, QualityGrade } from '@prisma/client';
import { LotsService } from './lots.service';
import { PrismaService } from '@fe/db';

const mockLot = {
  id: 'uuid-1',
  warehouseId: 'wh-1',
  exploitationId: 'exp-1',
  storedAt: new Date('2026-01-01'),
  status: LotStatus.conforme,
  qualityGrade: QualityGrade.standard,
  weightKg: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  lot: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('LotsService', () => {
  let service: LotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LotsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LotsService>(LotsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retourne les lots triés FIFO sans filtre', async () => {
      mockPrisma.lot.findMany.mockResolvedValue([mockLot]);

      const result = await service.findAll({});

      expect(mockPrisma.lot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { storedAt: 'asc' } }),
      );
      expect(result).toEqual([mockLot]);
    });

    it('filtre par warehouseId', async () => {
      mockPrisma.lot.findMany.mockResolvedValue([mockLot]);

      await service.findAll({ warehouseId: 'wh-1' });

      expect(mockPrisma.lot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { warehouseId: 'wh-1' } }),
      );
    });

    it('filtre par status', async () => {
      mockPrisma.lot.findMany.mockResolvedValue([]);

      await service.findAll({ status: LotStatus.alerte });

      expect(mockPrisma.lot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: LotStatus.alerte } }),
      );
    });
  });

  describe('findOne', () => {
    it('retourne le lot si trouvé', async () => {
      mockPrisma.lot.findUnique.mockResolvedValue(mockLot);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(mockLot);
    });

    it('lève une NotFoundException si lot inexistant', async () => {
      mockPrisma.lot.findUnique.mockResolvedValue(null);

      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('crée un lot avec les données fournies', async () => {
      mockPrisma.lot.create.mockResolvedValue(mockLot);

      const result = await service.create({
        warehouseId: 'wh-1',
        exploitationId: 'exp-1',
        weightKg: 100,
      });

      expect(mockPrisma.lot.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            warehouseId: 'wh-1',
            exploitationId: 'exp-1',
            weightKg: 100,
          }),
        }),
      );
      expect(result).toEqual(mockLot);
    });

    it('utilise storedAt si fourni', async () => {
      mockPrisma.lot.create.mockResolvedValue(mockLot);

      await service.create({
        warehouseId: 'wh-1',
        exploitationId: 'exp-1',
        weightKg: 50,
        storedAt: '2026-01-01T00:00:00Z',
      });

      expect(mockPrisma.lot.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            storedAt: new Date('2026-01-01T00:00:00Z'),
          }),
        }),
      );
    });
  });

  describe('updateStatus', () => {
    it('met à jour le statut du lot', async () => {
      mockPrisma.lot.findUnique.mockResolvedValue(mockLot);
      mockPrisma.lot.update.mockResolvedValue({
        ...mockLot,
        status: LotStatus.alerte,
      });

      const result = await service.updateStatus('uuid-1', {
        status: LotStatus.alerte,
      });

      expect(mockPrisma.lot.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: { status: LotStatus.alerte },
      });
      expect(result.status).toBe(LotStatus.alerte);
    });

    it('lève une NotFoundException si lot inexistant', async () => {
      mockPrisma.lot.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('unknown', { status: LotStatus.perime }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
