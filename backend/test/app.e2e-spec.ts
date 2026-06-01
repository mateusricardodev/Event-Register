/**
 * E2E — inscrições.app
 *
 * Pré-requisitos:
 *   docker-compose -f docker-compose.test.yml up -d
 *   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/inscricoes_test npx prisma migrate deploy
 *   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/inscricoes_test npm run test:e2e
 */

import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

// Aponta para banco de testes
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5433/inscricoes_test?schema=public';
process.env.JWT_SECRET = 'e2e-test-secret';
process.env.MAIL_HOST = 'localhost';
process.env.MAIL_PORT = '1025';
process.env.MAIL_SECURE = 'false';
process.env.MAIL_USER = 'test';
process.env.MAIL_PASS = 'test';

async function cleanDatabase(prisma: PrismaService) {
  await prisma.db.payment.deleteMany();
  await prisma.db.registration.deleteMany();
  await prisma.db.eventPaymentMethod.deleteMany();
  await prisma.db.ticket.deleteMany();
  await prisma.db.event.deleteMany();
  await prisma.db.user.deleteMany();
}

describe('inscrições.app (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await cleanDatabase(prisma);
    await app.close();
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // AUTH
  // ──────────────────────────────────────────────────────────────────────────

  describe('Auth', () => {
    it('POST /auth/register — cria conta e retorna dados do usuário', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Teste E2E', email: 'e2e@test.com', password: 'senha123' })
        .expect(201);

      expect(res.body).toMatchObject({ email: 'e2e@test.com', role: 'user' });
      expect(res.body).not.toHaveProperty('password');
    });

    it('POST /auth/register — 409 para email duplicado', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'A', email: 'dup@test.com', password: 'senha123' });

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'B', email: 'dup@test.com', password: 'senha456' })
        .expect(409);
    });

    it('POST /auth/login — retorna access_token', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Login', email: 'login@test.com', password: 'senha123' });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@test.com', password: 'senha123' })
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
    });

    it('POST /auth/login — 401 para senha errada', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'X', email: 'x@test.com', password: 'certa' });

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'x@test.com', password: 'errada' })
        .expect(401);
    });

    it('GET /auth/me — 401 sem token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('GET /auth/me — retorna dados do usuário autenticado', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Me User', email: 'me@test.com', password: 'senha123' });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'me@test.com', password: 'senha123' });

      const token = loginRes.body.access_token;

      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toMatchObject({ email: 'me@test.com', name: 'Me User' });
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Helpers para o fluxo principal
  // ──────────────────────────────────────────────────────────────────────────

  async function registerAndLogin(email = 'org@test.com', password = 'senha123') {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Org', email, password });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    return res.body.access_token as string;
  }

  async function createEvent(token: string, overrides: Record<string, unknown> = {}) {
    const res = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Conferência E2E', date: '2026-09-01', slug: `conf-${Date.now()}`, ...overrides })
      .expect(201);

    return res.body;
  }

  async function createTicket(token: string, eventId: string, quantity = 10) {
    const res = await request(app.getHttpServer())
      .post(`/events/${eventId}/tickets`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Geral', price: 0, quantity });

    return res.body;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENTS
  // ──────────────────────────────────────────────────────────────────────────

  describe('Events', () => {
    it('POST /events — 401 sem autenticação', async () => {
      await request(app.getHttpServer())
        .post('/events')
        .send({ title: 'X', date: '2026-09-01' })
        .expect(401);
    });

    it('POST /events — cria evento autenticado', async () => {
      const token = await registerAndLogin();
      const event = await createEvent(token);

      expect(event).toHaveProperty('id');
      expect(event.title).toBe('Conferência E2E');
    });

    it('PUT /events/:id — 403 quando outro usuário tenta editar', async () => {
      const ownerToken = await registerAndLogin('owner@test.com');
      const otherToken = await registerAndLogin('other@test.com');

      const event = await createEvent(ownerToken);

      await request(app.getHttpServer())
        .put(`/events/${event.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hackear' })
        .expect(403);
    });

    it('DELETE /events/:id — 403 quando outro usuário tenta remover', async () => {
      const ownerToken = await registerAndLogin('del-owner@test.com');
      const otherToken = await registerAndLogin('del-other@test.com');
      const event = await createEvent(ownerToken);

      await request(app.getHttpServer())
        .delete(`/events/${event.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);
    });

    it('GET /events — retorna apenas eventos do usuário autenticado', async () => {
      const t1 = await registerAndLogin('u1@test.com');
      const t2 = await registerAndLogin('u2@test.com');

      await createEvent(t1);
      await createEvent(t2);

      const res = await request(app.getHttpServer())
        .get('/events')
        .set('Authorization', `Bearer ${t1}`)
        .expect(200);

      expect(res.body.length).toBe(1);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // INSCRIÇÕES PÚBLICAS
  // ──────────────────────────────────────────────────────────────────────────

  describe('Inscrições públicas', () => {
    it('POST /events/public/:slug/register — inscreve sem autenticação', async () => {
      const token = await registerAndLogin();
      const event = await createEvent(token);

      // Publicar o evento
      await request(app.getHttpServer())
        .put(`/events/${event.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ isPublished: true });

      const res = await request(app.getHttpServer())
        .post(`/events/public/${event.slug}/register`)
        .send({ name: 'Participante', email: 'part@test.com', cpf: '12345678900' })
        .expect(201);

      expect(res.body).toHaveProperty('id');
    });

    it('POST /events/public/:slug/register — 400 para evento não publicado', async () => {
      const token = await registerAndLogin('pub@test.com');
      const event = await createEvent(token); // isPublished = false por padrão

      await request(app.getHttpServer())
        .post(`/events/public/${event.slug}/register`)
        .send({ name: 'X', email: 'x@test.com', cpf: '00000000000' })
        .expect(400);
    });

    it('POST /events/public/:slug/register — 400 quando evento lotado', async () => {
      const token = await registerAndLogin('full@test.com');
      const event = await createEvent(token, { maxParticipants: 1 });

      await request(app.getHttpServer())
        .put(`/events/${event.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ isPublished: true });

      // Primeira inscrição — deve funcionar
      await request(app.getHttpServer())
        .post(`/events/public/${event.slug}/register`)
        .send({ name: 'A', email: 'a@test.com', cpf: '11111111111' })
        .expect(201);

      // Segunda inscrição — deve retornar 400
      await request(app.getHttpServer())
        .post(`/events/public/${event.slug}/register`)
        .send({ name: 'B', email: 'b@test.com', cpf: '22222222222' })
        .expect(400);
    });

    it('POST /events/public/:slug/register — 400 para slug inexistente', async () => {
      await request(app.getHttpServer())
        .post('/events/public/nao-existe/register')
        .send({ name: 'X', email: 'x@test.com', cpf: '00000000000' })
        .expect(404);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // FLUXO PRINCIPAL: registrar → logar → criar evento → inscrever → listar
  // ──────────────────────────────────────────────────────────────────────────

  describe('Fluxo principal completo', () => {
    it('organiza evento, inscreve participante e lista inscrições', async () => {
      // 1. Criar conta e logar como organizador
      const token = await registerAndLogin('fluxo@test.com');

      // 2. Criar evento
      const event = await createEvent(token, { maxParticipants: 50 });
      expect(event).toHaveProperty('id');

      // 3. Criar ticket
      const ticket = await createTicket(token, event.id, 20);
      expect(ticket).toHaveProperty('id');

      // 4. Publicar evento
      await request(app.getHttpServer())
        .put(`/events/${event.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ isPublished: true })
        .expect(200);

      // 5. Inscrição pública (sem auth)
      const regRes = await request(app.getHttpServer())
        .post(`/events/public/${event.slug}/register`)
        .send({ name: 'Participante', email: 'participante@test.com', cpf: '98765432100' })
        .expect(201);

      expect(regRes.body).toHaveProperty('id');

      // 6. Listar inscrições (autenticado como organizador)
      const listRes = await request(app.getHttpServer())
        .get(`/events/${event.id}/registrations`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(listRes.body.length).toBe(1);
      expect(listRes.body[0].user.email).toBe('participante@test.com');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // RACE CONDITION (prova do bug C-01)
  // Este teste FALHA hoje e PASSA após a correção com transação Serializable
  // ──────────────────────────────────────────────────────────────────────────

  describe('Race condition — BUG C-01', () => {
    it('FALHA ESPERADA: evento com 1 vaga aceita N inscrições simultâneas', async () => {
      const token = await registerAndLogin('race@test.com');
      const event = await createEvent(token, { maxParticipants: 1 });

      await request(app.getHttpServer())
        .put(`/events/${event.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ isPublished: true });

      // Dispara 10 inscrições simultâneas
      const promises = Array.from({ length: 10 }, (_, i) =>
        request(app.getHttpServer())
          .post(`/events/public/${event.slug}/register`)
          .send({ name: `User ${i}`, email: `race${i}@test.com`, cpf: `${String(i).padStart(11, '0')}` }),
      );

      const results = await Promise.all(promises);
      const successes = results.filter((r) => r.status === 201);

      // Verifica no banco quantas inscrições foram realmente criadas
      const count = await prisma.db.registration.count({
        where: { eventId: event.id, status: { not: 'canceled' } },
      });

      console.log(`Inscrições criadas no banco: ${count} (esperado: 1)`);
      console.log(`Respostas 201 recebidas: ${successes.length}`);

      // Esta assertion FALHA hoje (count > 1), provando o bug
      // Após a correção, count deve ser === 1
      expect(count).toBe(1);
    });
  });
});
