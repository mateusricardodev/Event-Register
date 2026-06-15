import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PublicService } from './public.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentsService } from '../payments/payments.service.js';
import { PAYMENT_PROVIDER_TOKEN } from '../payments/providers/payment-provider.factory.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDb: any = {
  event: { findUnique: jest.fn() },
  ticket: { findUnique: jest.fn() },
  registration: {
    findUnique: jest.fn().mockResolvedValue(null), // para generateUniqueRegistrationCode
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: { findUnique: jest.fn(), create: jest.fn() },
  payment: { create: jest.fn(), delete: jest.fn(), findFirst: jest.fn() },
  $transaction: jest.fn().mockImplementation((cb: (tx: unknown) => unknown) =>
    typeof cb === 'function' ? cb(mockDb) : Promise.all(cb as Promise<unknown>[]),
  ),
};

const mockPrisma = { db: mockDb };

const mockPixResult = {
  paymentId: 'pay-1',
  providerPaymentId: 'mock_abc-123',
  qrCodeBase64: 'base64==',
  qrCodeCopiaECola: '0002...',
  expiresAt: new Date('2099-01-01'),
  amount: 99.9,
};

const mockPayments = {
  createPixForRegistration: jest.fn().mockResolvedValue(mockPixResult),
};

// PaymentsService precisa do PAYMENT_PROVIDER_TOKEN para instanciar
const mockProvider = { createPixPayment: jest.fn(), getPaymentStatus: jest.fn() };

const EVENT_ID = 'event-uuid';
const TICKET_ID = 'ticket-uuid';
const SLUG = 'evento-teste';
const SHADOW_USER_ID = 'shadow-user-uuid';

const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 dias
const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);        // ontem

const baseEvent = {
  id: EVENT_ID,
  title: 'Evento Teste',
  isPublished: true,
  date: futureDate,
  location: 'São Paulo',
  maxParticipants: null,
};

const baseTicket = {
  id: TICKET_ID,
  eventId: EVENT_ID,
  name: 'Inteira',
  price: 99.9,
  quantity: 100,
};

const baseUser = { id: SHADOW_USER_ID, name: 'Ana', email: 'ana@test.com' };

const baseDto = {
  ticketId: TICKET_ID,
  fullName: 'Ana Silva',
  email: 'ana@test.com',
  cpf: '529.982.247-25', // CPF válido com máscara
  phone: '11999999999',
  termsAccepted: true as const,
};

describe('PublicService', () => {
  let service: PublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaymentsService, useValue: mockPayments },
        { provide: PAYMENT_PROVIDER_TOKEN, useValue: mockProvider },
      ],
    }).compile();

    service = module.get<PublicService>(PublicService);
    jest.clearAllMocks();
    mockDb.$transaction.mockImplementation((cb: (tx: unknown) => unknown) =>
      typeof cb === 'function' ? cb(mockDb) : Promise.all(cb as Promise<unknown>[]),
    );
  });

  // ─── findEventBySlug ─────────────────────────────────────────────────────────

  describe('findEventBySlug', () => {
    it('retorna evento publicado com vagas disponíveis por ticket', async () => {
      mockDb.event.findUnique.mockResolvedValue({
        ...baseEvent,
        slug: SLUG,
        tickets: [
          { id: TICKET_ID, name: 'Inteira', price: 99.9, quantity: 100, _count: { registrations: 30 } },
        ],
        user: { name: 'Org' },
      });

      const result = await service.findEventBySlug(SLUG);

      expect(result.tickets[0].available).toBe(70);
    });

    it('lança NotFoundException para evento inexistente', async () => {
      mockDb.event.findUnique.mockResolvedValue(null);
      await expect(service.findEventBySlug('nao-existe')).rejects.toThrow(NotFoundException);
    });

    it('lança NotFoundException para evento não publicado', async () => {
      mockDb.event.findUnique.mockResolvedValue({
        ...baseEvent, isPublished: false, tickets: [], user: { name: 'Org' },
      });
      await expect(service.findEventBySlug(SLUG)).rejects.toThrow(NotFoundException);
    });

    it('never expõe dados de outros inscritos', async () => {
      mockDb.event.findUnique.mockResolvedValue({
        ...baseEvent,
        slug: SLUG,
        tickets: [{ id: TICKET_ID, name: 'Inteira', price: 0, quantity: 10, _count: { registrations: 0 } }],
        user: { name: 'Org' },
      });

      const result = await service.findEventBySlug(SLUG);

      expect(result).not.toHaveProperty('registrations');
      expect(result.tickets[0]).not.toHaveProperty('_count');
    });
  });

  // ─── register ────────────────────────────────────────────────────────────────

  describe('register', () => {
    const setup = () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.ticket.findUnique.mockResolvedValue(baseTicket);
      mockDb.registration.findFirst.mockResolvedValue(null); // sem duplicata
      mockDb.registration.count.mockResolvedValue(0);
      mockDb.user.findUnique.mockResolvedValue(baseUser);
      mockDb.registration.create.mockResolvedValue({
        id: 'reg-1',
        userId: SHADOW_USER_ID,
        eventId: EVENT_ID,
        ticketId: TICKET_ID,
        status: 'pending',
        cpf: '52998224725',
      });
    };

    it('fluxo completo: inscrição pending + PIX gerado com amount do banco', async () => {
      setup();

      const result = await service.register(SLUG, baseDto);

      expect(result.status).toBe('pending');
      expect(result.qrCodeBase64).toBe('base64==');
      expect(result.qrCodeCopiaECola).toBe('0002...');
      expect(result.amount).toBe(99.9);
      expect(mockPayments.createPixForRegistration).toHaveBeenCalledWith(
        'reg-1',
        SHADOW_USER_ID,
      );
    });

    it('normaliza o CPF (remove máscara) antes de salvar', async () => {
      setup();

      await service.register(SLUG, { ...baseDto, cpf: '529.982.247-25' });

      expect(mockDb.registration.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ cpf: '52998224725' }) }),
      );
    });

    it('cria shadow user quando email não existe', async () => {
      setup();
      mockDb.user.findUnique.mockResolvedValue(null);
      mockDb.user.create.mockResolvedValue({ id: 'new-user', name: 'Ana', email: 'ana@test.com' });
      mockDb.registration.create.mockResolvedValue({
        id: 'reg-1', userId: 'new-user', eventId: EVENT_ID, status: 'pending',
      });

      await service.register(SLUG, baseDto);

      expect(mockDb.user.create).toHaveBeenCalledTimes(1);
      expect(mockDb.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ email: 'ana@test.com' }) }),
      );
    });

    it('lança NotFoundException para evento inexistente ou não publicado', async () => {
      mockDb.event.findUnique.mockResolvedValue(null);
      await expect(service.register(SLUG, baseDto)).rejects.toThrow(NotFoundException);
    });

    it('lança NotFoundException para evento não publicado', async () => {
      mockDb.event.findUnique.mockResolvedValue({ ...baseEvent, isPublished: false });
      await expect(service.register(SLUG, baseDto)).rejects.toThrow(NotFoundException);
    });

    it('lança BadRequestException quando evento já aconteceu (prazo encerrado)', async () => {
      mockDb.event.findUnique.mockResolvedValue({ ...baseEvent, date: pastDate });
      await expect(service.register(SLUG, baseDto)).rejects.toThrow(BadRequestException);
    });

    it('lança NotFoundException para ticket inexistente', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.ticket.findUnique.mockResolvedValue(null);
      await expect(service.register(SLUG, baseDto)).rejects.toThrow(NotFoundException);
    });

    it('lança BadRequestException para ticket de outro evento', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.ticket.findUnique.mockResolvedValue({ ...baseTicket, eventId: 'outro-evento' });
      await expect(service.register(SLUG, baseDto)).rejects.toThrow(BadRequestException);
    });

    it('lança ConflictException quando ingressos esgotados', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.ticket.findUnique.mockResolvedValue({ ...baseTicket, quantity: 10 });
      mockDb.registration.findFirst.mockResolvedValue(null);
      mockDb.registration.count.mockResolvedValue(10); // lotado

      await expect(service.register(SLUG, baseDto)).rejects.toThrow(ConflictException);
      expect(mockPayments.createPixForRegistration).not.toHaveBeenCalled();
    });

    it('lança ConflictException quando evento lotado (maxParticipants)', async () => {
      mockDb.event.findUnique.mockResolvedValue({ ...baseEvent, maxParticipants: 5 });
      mockDb.ticket.findUnique.mockResolvedValue(baseTicket);
      mockDb.registration.findFirst.mockResolvedValue(null);
      mockDb.registration.count.mockResolvedValue(5); // evento lotado

      await expect(service.register(SLUG, baseDto)).rejects.toThrow(ConflictException);
    });

    describe('anti-duplicidade', () => {
      it('reutiliza inscrição+PIX existente quando mesmo CPF tem cobrança pendente válida', async () => {
        const existingPayment = {
          id: 'pay-old',
          providerPaymentId: 'mock_existente',
          qrCodeBase64: 'oldqr==',
          qrCodeCopiaECola: '0002existing',
          expiresAt: new Date('2099-01-01'),
          amount: 99.9,
        };
        mockDb.event.findUnique.mockResolvedValue(baseEvent);
        mockDb.ticket.findUnique.mockResolvedValue(baseTicket);
        mockDb.registration.findFirst.mockResolvedValue({
          id: 'reg-old',
          cpf: '52998224725',
          status: 'pending',
          payment: existingPayment,
        });

        const result = await service.register(SLUG, baseDto);

        // Não cria nova inscrição nem novo PIX
        expect(mockDb.registration.create).not.toHaveBeenCalled();
        expect(mockPayments.createPixForRegistration).not.toHaveBeenCalled();
        expect(result.registrationId).toBe('reg-old');
        expect(result.qrCodeBase64).toBe('oldqr==');
        expect((result as { reused?: boolean }).reused).toBe(true);
      });

      it('cria nova inscrição quando PIX anterior já expirou', async () => {
        // findFirst retorna null (expiresAt < now, filtrado pela query where)
        mockDb.event.findUnique.mockResolvedValue(baseEvent);
        mockDb.ticket.findUnique.mockResolvedValue(baseTicket);
        mockDb.registration.findFirst.mockResolvedValue(null);
        mockDb.registration.count.mockResolvedValue(0);
        mockDb.user.findUnique.mockResolvedValue(baseUser);
        mockDb.registration.create.mockResolvedValue({
          id: 'reg-new', userId: SHADOW_USER_ID, eventId: EVENT_ID, status: 'pending',
        });

        const result = await service.register(SLUG, baseDto);

        expect(mockDb.registration.create).toHaveBeenCalledTimes(1);
        expect(result.registrationId).toBe('reg-new');
        expect((result as { reused?: boolean }).reused).toBeUndefined();
      });
    });
  });
});
