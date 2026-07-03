import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertType, LotStatus } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '@fe/db';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  private readonly transporter = nodemailer.createTransport({
    host: process.env['MAIL_HOST'],
    port: Number(process.env['MAIL_PORT']) || 587,
    auth: {
      user: process.env['MAIL_USER'],
      pass: process.env['MAIL_PASS'],
    },
  });

  constructor(private readonly prisma: PrismaService) {}

  async checkThresholds(warehouseId: string, temperature: number, humidity: number): Promise<void> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
      include: { country: true },
    });

    if (!warehouse) return;

    const { country } = warehouse;
    const alerts: { type: AlertType; message: string }[] = [];

    if (temperature > country.tempIdeal + country.tempTolerance) {
      alerts.push({ type: AlertType.temperature_haute, message: `Température trop haute : ${temperature}°C (seuil : ${country.tempIdeal + country.tempTolerance}°C)` });
    } else if (temperature < country.tempIdeal - country.tempTolerance) {
      alerts.push({ type: AlertType.temperature_basse, message: `Température trop basse : ${temperature}°C (seuil : ${country.tempIdeal - country.tempTolerance}°C)` });
    }

    if (humidity > country.humidityIdeal + country.humidityTolerance) {
      alerts.push({ type: AlertType.humidite_haute, message: `Humidité trop haute : ${humidity}% (seuil : ${country.humidityIdeal + country.humidityTolerance}%)` });
    } else if (humidity < country.humidityIdeal - country.humidityTolerance) {
      alerts.push({ type: AlertType.humidite_basse, message: `Humidité trop basse : ${humidity}% (seuil : ${country.humidityIdeal - country.humidityTolerance}%)` });
    }

    for (const alert of alerts) {
      await this.prisma.alert.create({
        data: { warehouseId, type: alert.type, message: alert.message },
      });

      await this.sendEmail(
        warehouse.managerEmail,
        `[FutureKawa] Alerte conditions — ${warehouse.name}`,
        alert.message,
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredLots(): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 365);

    const expiredLots = await this.prisma.lot.findMany({
      where: {
        storedAt: { lte: expirationDate },
        status: { not: LotStatus.perime },
      },
      include: { warehouse: true },
    });

    for (const lot of expiredLots) {
      await this.prisma.lot.update({
        where: { id: lot.id },
        data: { status: LotStatus.perime },
      });

      await this.prisma.alert.create({
        data: {
          warehouseId: lot.warehouseId,
          lotId: lot.id,
          type: AlertType.lot_perime,
          message: `Lot ${lot.id} stocké depuis plus de 365 jours (depuis le ${lot.storedAt.toLocaleDateString('fr-FR')})`,
        },
      });

      await this.sendEmail(
        lot.warehouse.managerEmail,
        `[FutureKawa] Lot périmé — ${lot.id}`,
        `Le lot ${lot.id} est stocké depuis plus de 365 jours et doit être expédié en priorité.`,
      );

      this.logger.warn(`Lot ${lot.id} marked as perime`);
    }
  }

  private async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env['MAIL_FROM'],
        to,
        subject,
        text,
      });
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err}`);
    }
  }
}
