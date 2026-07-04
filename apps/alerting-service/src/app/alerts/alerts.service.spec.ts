import { Test, TestingModule } from '@nestjs/testing';
import { AlertType, LotStatus, QualityGrade } from '@prisma/client';
import { AlertsService } from './alerts.service';
import { PrismaService } from '@fe/db';

const mockWarehouse = {
  id: 'wh-1',
  name: 'Hub São Paulo',
  managerEmail: 'manager@futurekawa.com',
  country: {
    tempIdeal: 29,
    tempTolerance: 3,
    humidityIdeal: 55,
    humidityTolerance: 2,
  },
};

const mockPrisma = {
  warehouse: { findUnique: jest.fn() },
  alert: { create: jest.fn() },
  lot: { findMany: jest.fn(), update: jest.fn() },
};

const mockTransporter = { sendMail: jest.fn().mockResolvedValue({}) };

describe('AlertsService', () => {
  let service: AlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    // @ts-expect-error — override private transporter
    service['transporter'] = mockTransporter;
    jest.clearAllMocks();
  });

  describe('checkThresholds', () => {
    beforeEach(() => {
      mockPrisma.warehouse.findUnique.mockResolvedValue(mockWarehouse);
      mockPrisma.alert.create.mockResolvedValue({});
    });

    it('ne crée pas d\'alerte si les valeurs sont dans les seuils', async () => {
      await service.checkThresholds('wh-1', 29, 55);

      expect(mockPrisma.alert.create).not.toHaveBeenCalled();
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('crée une alerte temperature_haute si temp > ideal + tolerance', async () => {
      await service.checkThresholds('wh-1', 33, 55); // 33 > 29 + 3

      expect(mockPrisma.alert.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ type: AlertType.temperature_haute }) }),
      );
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
    });

    it('crée une alerte temperature_basse si temp < ideal - tolerance', async () => {
      await service.checkThresholds('wh-1', 25, 55); // 25 < 29 - 3

      expect(mockPrisma.alert.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ type: AlertType.temperature_basse }) }),
      );
    });

    it('crée une alerte humidite_haute si humidity > ideal + tolerance', async () => {
      await service.checkThresholds('wh-1', 29, 58); // 58 > 55 + 2

      expect(mockPrisma.alert.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ type: AlertType.humidite_haute }) }),
      );
    });

    it('crée une alerte humidite_basse si humidity < ideal - tolerance', async () => {
      await service.checkThresholds('wh-1', 29, 52); // 52 < 55 - 2

      expect(mockPrisma.alert.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ type: AlertType.humidite_basse }) }),
      );
    });

    it('crée deux alertes si temp et humidity sont hors seuils', async () => {
      await service.checkThresholds('wh-1', 33, 58);

      expect(mockPrisma.alert.create).toHaveBeenCalledTimes(2);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
    });

    it('ne fait rien si l\'entrepôt est introuvable', async () => {
      mockPrisma.warehouse.findUnique.mockResolvedValue(null);

      await service.checkThresholds('unknown', 99, 99);

      expect(mockPrisma.alert.create).not.toHaveBeenCalled();
    });
  });

  describe('checkExpiredLots', () => {
    const expiredLot = {
      id: 'lot-old',
      warehouseId: 'wh-1',
      storedAt: new Date('2024-01-01'),
      status: LotStatus.conforme,
      qualityGrade: QualityGrade.standard,
      weightKg: 100,
      warehouse: { managerEmail: 'manager@futurekawa.com' },
    };

    it('marque les lots périmés et envoie un email', async () => {
      mockPrisma.lot.findMany.mockResolvedValue([expiredLot]);
      mockPrisma.lot.update.mockResolvedValue({});
      mockPrisma.alert.create.mockResolvedValue({});

      await service.checkExpiredLots();

      expect(mockPrisma.lot.update).toHaveBeenCalledWith({
        where: { id: 'lot-old' },
        data: { status: LotStatus.perime },
      });
      expect(mockPrisma.alert.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ type: AlertType.lot_perime, lotId: 'lot-old' }) }),
      );
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
    });

    it('ne fait rien s\'il n\'y a pas de lots périmés', async () => {
      mockPrisma.lot.findMany.mockResolvedValue([]);

      await service.checkExpiredLots();

      expect(mockPrisma.lot.update).not.toHaveBeenCalled();
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });
  });
});
