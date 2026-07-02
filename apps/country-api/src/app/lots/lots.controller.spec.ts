import { Test, TestingModule } from '@nestjs/testing';
import { LotStatus, QualityGrade } from '@prisma/client';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';

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

const mockLotsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
};

describe('LotsController', () => {
  let controller: LotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotsController],
      providers: [{ provide: LotsService, useValue: mockLotsService }],
    }).compile();

    controller = module.get<LotsController>(LotsController);
    jest.clearAllMocks();
  });

  it('GET /lots — appelle findAll avec le query', async () => {
    mockLotsService.findAll.mockResolvedValue([mockLot]);

    const result = await controller.findAll({ warehouseId: 'wh-1' });

    expect(mockLotsService.findAll).toHaveBeenCalledWith({ warehouseId: 'wh-1' });
    expect(result).toEqual([mockLot]);
  });

  it('GET /lots/:id — appelle findOne avec l\'id', async () => {
    mockLotsService.findOne.mockResolvedValue(mockLot);

    const result = await controller.findOne('uuid-1');

    expect(mockLotsService.findOne).toHaveBeenCalledWith('uuid-1');
    expect(result).toEqual(mockLot);
  });

  it('POST /lots — appelle create avec le dto', async () => {
    mockLotsService.create.mockResolvedValue(mockLot);

    const dto = { warehouseId: 'wh-1', exploitationId: 'exp-1', weightKg: 100 };
    const result = await controller.create(dto);

    expect(mockLotsService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockLot);
  });

  it('PATCH /lots/:id/status — appelle updateStatus', async () => {
    const updated = { ...mockLot, status: LotStatus.alerte };
    mockLotsService.updateStatus.mockResolvedValue(updated);

    const result = await controller.updateStatus('uuid-1', {
      status: LotStatus.alerte,
    });

    expect(mockLotsService.updateStatus).toHaveBeenCalledWith('uuid-1', {
      status: LotStatus.alerte,
    });
    expect(result.status).toBe(LotStatus.alerte);
  });
});
