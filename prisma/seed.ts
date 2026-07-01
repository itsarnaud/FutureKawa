import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ─── Pays ────────────────────────────────────────────────────────────────────
  const brazil = await prisma.country.upsert({
    where: { code: 'BR' },
    update: {},
    create: { code: 'BR', name: 'Brésil', tempIdeal: 29, humidityIdeal: 55 },
  });

  const ecuador = await prisma.country.upsert({
    where: { code: 'EC' },
    update: {},
    create: { code: 'EC', name: 'Équateur', tempIdeal: 31, humidityIdeal: 60 },
  });

  const colombia = await prisma.country.upsert({
    where: { code: 'CO' },
    update: {},
    create: { code: 'CO', name: 'Colombie', tempIdeal: 26, humidityIdeal: 80 },
  });

  // ─── Entrepôts ───────────────────────────────────────────────────────────────
  const whBR = await prisma.warehouse.upsert({
    where: { id: 'wh-br-sao-paulo' },
    update: {},
    create: {
      id: 'wh-br-sao-paulo',
      countryId: brazil.id,
      name: 'Hub São Paulo',
      address: 'Av. Paulista, São Paulo, SP',
      managerEmail: 'manager.brazil@futurekawa.com',
    },
  });

  const whEC = await prisma.warehouse.upsert({
    where: { id: 'wh-ec-quito' },
    update: {},
    create: {
      id: 'wh-ec-quito',
      countryId: ecuador.id,
      name: 'Hub Quito',
      address: 'Av. Amazonas, Quito',
      managerEmail: 'manager.ecuador@futurekawa.com',
    },
  });

  const whCO = await prisma.warehouse.upsert({
    where: { id: 'wh-co-bogota' },
    update: {},
    create: {
      id: 'wh-co-bogota',
      countryId: colombia.id,
      name: 'Hub Bogotá',
      address: 'Calle 26, Bogotá',
      managerEmail: 'manager.colombia@futurekawa.com',
    },
  });

  // ─── Exploitations ───────────────────────────────────────────────────────────
  const expBR = await prisma.exploitation.upsert({
    where: { id: 'exp-br-minas' },
    update: {},
    create: {
      id: 'exp-br-minas',
      countryId: brazil.id,
      name: 'Fazenda Minas Gerais',
      location: 'Minas Gerais, Brésil',
    },
  });

  const expEC = await prisma.exploitation.upsert({
    where: { id: 'exp-ec-pichincha' },
    update: {},
    create: {
      id: 'exp-ec-pichincha',
      countryId: ecuador.id,
      name: 'Finca Pichincha',
      location: 'Province de Pichincha, Équateur',
    },
  });

  const expCO = await prisma.exploitation.upsert({
    where: { id: 'exp-co-huila' },
    update: {},
    create: {
      id: 'exp-co-huila',
      countryId: colombia.id,
      name: 'Finca Huila',
      location: 'Département de Huila, Colombie',
    },
  });

  // ─── Devices IoT ─────────────────────────────────────────────────────────────
  await prisma.iotDevice.upsert({
    where: { mqttTopic: 'bresil/entrepot1/mesures' },
    update: {},
    create: {
      warehouseId: whBR.id,
      mqttTopic: 'bresil/entrepot1/mesures',
      firmwareVersion: '1.0.0',
    },
  });

  await prisma.iotDevice.upsert({
    where: { mqttTopic: 'equateur/entrepot1/mesures' },
    update: {},
    create: {
      warehouseId: whEC.id,
      mqttTopic: 'equateur/entrepot1/mesures',
      firmwareVersion: '1.0.0',
    },
  });

  await prisma.iotDevice.upsert({
    where: { mqttTopic: 'colombie/entrepot1/mesures' },
    update: {},
    create: {
      warehouseId: whCO.id,
      mqttTopic: 'colombie/entrepot1/mesures',
      firmwareVersion: '1.0.0',
    },
  });

  // ─── Lots d'exemple ──────────────────────────────────────────────────────────
  await prisma.lot.createMany({
    skipDuplicates: true,
    data: [
      { id: 'lot-br-001', warehouseId: whBR.id, exploitationId: expBR.id, weightKg: 500, storedAt: new Date('2026-01-15') },
      { id: 'lot-br-002', warehouseId: whBR.id, exploitationId: expBR.id, weightKg: 320, storedAt: new Date('2026-03-10') },
      { id: 'lot-ec-001', warehouseId: whEC.id, exploitationId: expEC.id, weightKg: 410, storedAt: new Date('2026-02-20') },
      { id: 'lot-co-001', warehouseId: whCO.id, exploitationId: expCO.id, weightKg: 275, storedAt: new Date('2026-04-05') },
    ],
  });

  console.log('Seed OK');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
