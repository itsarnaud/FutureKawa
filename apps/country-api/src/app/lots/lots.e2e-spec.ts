import 'dotenv/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PrismaService } from '@fe/db';
import { AppModule } from '../app.module';

/**
 * Integration/API-level tests: a real Nest HTTP server backed by the real
 * Postgres database (see prisma/schema.prisma), exercised through supertest
 * — as opposed to the unit tests elsewhere in this app, which mock Prisma.
 * Requires DATABASE_URL to point at a reachable country database (defaults
 * to the same one `npx prisma db push`/`db seed` use, see .env).
 *
 * Note: the internal API key guard (see ../common/internal-api-key.guard.ts)
 * is currently unwired in AppModule (no deployment yet, dev-friction
 * tradeoff) — these tests don't exercise it. Re-add coverage here once it's
 * wired back up.
 *
 * Run via `npx nx test-e2e country-api` — kept out of the fast unit suite
 * (`nx test country-api`) since it needs live infrastructure.
 */
describe('country-api (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const createdLotIds: string[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    if (createdLotIds.length) {
      await prisma.lot.deleteMany({ where: { id: { in: createdLotIds } } });
    }
    await app.close();
  });

  describe('GET /api/health', () => {
    it('reports the database as up', async () => {
      const res = await request(app.getHttpServer()).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'ok', database: 'up' });
    });
  });

  describe('GET /api/lots', () => {
    it('returns lots sorted FIFO (storedAt ascending)', async () => {
      const res = await request(app.getHttpServer()).get('/api/lots');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      const dates = res.body.map((lot: { storedAt: string }) => new Date(lot.storedAt).getTime());
      const sorted = [...dates].sort((a, b) => a - b);
      expect(dates).toEqual(sorted);
    });
  });

  describe('POST /api/lots + GET /api/lots/:id/mesures', () => {
    it('creates a lot against an existing warehouse/exploitation and reads it back', async () => {
      const seeded = await prisma.lot.findFirst({ include: { warehouse: true, exploitation: true } });
      expect(seeded).not.toBeNull();
      if (!seeded) return;

      const createRes = await request(app.getHttpServer())
        .post('/api/lots')
        .send({
          warehouseId: seeded.warehouseId,
          exploitationId: seeded.exploitationId,
          weightKg: 42,
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.weightKg).toBe(42);
      createdLotIds.push(createRes.body.id);

      const measuresRes = await request(app.getHttpServer()).get(
        `/api/lots/${createRes.body.id}/mesures`,
      );

      expect(measuresRes.status).toBe(200);
      expect(Array.isArray(measuresRes.body)).toBe(true);
    });

    it('returns 404 for an unknown lot id', async () => {
      const res = await request(app.getHttpServer()).get('/api/lots/does-not-exist/mesures');

      expect(res.status).toBe(404);
    });
  });
});
