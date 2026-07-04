import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

// Each country now runs in its own database. SEED_COUNTRY restricts the
// seed to a single country (used by each country-api instance); leaving it
// unset seeds all three, e.g. for local dev against a single shared DB.
const seedCountry = process.env['SEED_COUNTRY'];

type CountrySeed = {
  code: 'BR' | 'EC' | 'CO';
  name: string;
  tempIdeal: number;
  humidityIdeal: number;
  warehouse: { id: string; name: string; address: string; managerEmail: string };
  exploitation: { id: string; name: string; location: string };
  device: { mqttTopic: string };
  lots: { id: string; weightKg: number; storedAt: string }[];
};

const countries: CountrySeed[] = [
  {
    code: 'BR',
    name: 'Brésil',
    tempIdeal: 29,
    humidityIdeal: 55,
    warehouse: { id: 'wh-br-sao-paulo', name: 'Hub São Paulo', address: 'Av. Paulista, São Paulo, SP', managerEmail: 'manager.brazil@futurekawa.com' },
    exploitation: { id: 'exp-br-minas', name: 'Fazenda Minas Gerais', location: 'Minas Gerais, Brésil' },
    device: { mqttTopic: 'bresil/entrepot1/mesures' },
    lots: [
      { id: 'lot-br-001', weightKg: 500, storedAt: '2026-01-15' },
      { id: 'lot-br-002', weightKg: 320, storedAt: '2026-03-10' },
    ],
  },
  {
    code: 'EC',
    name: 'Équateur',
    tempIdeal: 31,
    humidityIdeal: 60,
    warehouse: { id: 'wh-ec-quito', name: 'Hub Quito', address: 'Av. Amazonas, Quito', managerEmail: 'manager.ecuador@futurekawa.com' },
    exploitation: { id: 'exp-ec-pichincha', name: 'Finca Pichincha', location: 'Province de Pichincha, Équateur' },
    device: { mqttTopic: 'equateur/entrepot1/mesures' },
    lots: [{ id: 'lot-ec-001', weightKg: 410, storedAt: '2026-02-20' }],
  },
  {
    code: 'CO',
    name: 'Colombie',
    tempIdeal: 26,
    humidityIdeal: 80,
    warehouse: { id: 'wh-co-bogota', name: 'Hub Bogotá', address: 'Calle 26, Bogotá', managerEmail: 'manager.colombia@futurekawa.com' },
    exploitation: { id: 'exp-co-huila', name: 'Finca Huila', location: 'Département de Huila, Colombie' },
    device: { mqttTopic: 'colombie/entrepot1/mesures' },
    lots: [{ id: 'lot-co-001', weightKg: 275, storedAt: '2026-04-05' }],
  },
];

async function seedCountryData(c: CountrySeed) {
  const country = await prisma.country.upsert({
    where: { code: c.code },
    update: {},
    create: { code: c.code, name: c.name, tempIdeal: c.tempIdeal, humidityIdeal: c.humidityIdeal },
  });

  const warehouse = await prisma.warehouse.upsert({
    where: { id: c.warehouse.id },
    update: {},
    create: { ...c.warehouse, countryId: country.id },
  });

  const exploitation = await prisma.exploitation.upsert({
    where: { id: c.exploitation.id },
    update: {},
    create: { ...c.exploitation, countryId: country.id },
  });

  await prisma.iotDevice.upsert({
    where: { mqttTopic: c.device.mqttTopic },
    update: {},
    create: { warehouseId: warehouse.id, mqttTopic: c.device.mqttTopic, firmwareVersion: '1.0.0' },
  });

  await prisma.lot.createMany({
    skipDuplicates: true,
    data: c.lots.map((lot) => ({
      id: lot.id,
      warehouseId: warehouse.id,
      exploitationId: exploitation.id,
      weightKg: lot.weightKg,
      storedAt: new Date(lot.storedAt),
    })),
  });
}

async function main() {
  const targets = seedCountry
    ? countries.filter((c) => c.code === seedCountry)
    : countries;

  if (seedCountry && targets.length === 0) {
    throw new Error(`Unknown SEED_COUNTRY "${seedCountry}", expected one of BR, EC, CO`);
  }

  for (const c of targets) {
    await seedCountryData(c);
  }

  console.log('Seed OK');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
