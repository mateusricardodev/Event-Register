import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PublicService } from './public.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentsService } from '../payments/payments.service.js';
import { MailService } from '../mail/mail.service.js';
import { PAYMENT_PROVIDER_TOKEN } from '../payments/providers/payment-provider.factory.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDb: any = {
  event: { findUnique: jest.fn() },
  eventPaymentMethod: { findUnique: jest.fn() },
  registration: {
    findUnique: jest.fn().mockResolvedValue(null),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
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

const mockMail = { sendRegistrationConfirmation: jest.fn() };

const mockProvider = { createPixPayment: jest.fn(), getPaymentStatus: jest.fn() };

const EVENT_ID = 'event-uuid';
const PM_ID = 'pm-uuid';
const SLUG = 'evento-teste';
const SHADOW_USER_ID = 'shadow-user-uuid';

const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
const pastDate   = new Date(Date.now() - 24 * 60 * 60 * 1000);

const baseEvent = {
  id: EVENT_ID,
  title: 'Evento Teste',
  isPublished: true,
  date: futureDate,
  location: 'São Paulo',
  maxParticipants: null,
};

const basePaymentMethod = {
  id: PM_ID,
  eventId: EVENT_ID,
  type: 'pix',
  value: 99.9,
  installments: 1,
};

const baseUser = { id: SHADOW_USER_ID, name: 'Ana', email: 'ana@test.com' };

const baseDto = {
  paymentMethodId: PM_ID,
  fullName: 'Ana Silva',
  email: 'ana@test.com',
  cpf: '529.982.247-25',
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
        { provide: MailService, useValue: mockMail },
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
    it('retorna evento publicado com formas de pagamento', async () => {
      mockDb.event.findUnique.mockResolvedValue({
        ...baseEvent,
        slug: SLUG,
        paymentMethods: [{ id: PM_ID, type: 'pix', value: 99.9, installments: 1 }],
        user: { name: 'Org' },
      });

      const result = await service.findEventBySlug(SLUG);

      expect(result.paymentMethods[0].type).toBe('pix');
    });

    it('lança NotFoundException para evento inexistente', async () => {
      mockDb.event.findUnique.mockResolvedValue(null);
      await expect(service.findEventBySlug('nao-existe')).rejects.toThrow(NotFoundException);
    });

    it('lança NotFoundException para evento não publicado', async () => {
      mockDb.event.findUnique.mockResolvedValue({
        ...baseEvent, isPublished: false, paymentMethods: [], user: { name: 'Org' },
      });
      await expect(service.findEventBySlug(SLUG)).rejects.toThrow(NotFoundException);
    });

    it('nunca expõe dados de outros inscritos', async () => {
      mockDb.event.findUnique.mockResolvedValue({
        ...baseEvent,
        slug: SLUG,
        paymentMethods: [],
        user: { name: 'Org' },
      });

      const result = await service.findEventBySlug(SLUG);

      expect(result).not.toHaveProperty('registrations');
    });
  });

  // ─── register ────────────────────────────────────────────────────────────────

  describe('register', () => {
    const setup = () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.eventPaymentMethod.findUnique.mockResolvedValue(basePaymentMethod);
      mockDb.registration.findFirst.mockResolvedValue(null);
      mockDb.registration.count.mockResolvedValue(0);
      mockDb.user.findUnique.mockResolvedValue(baseUser);
      mockDb.registration.create.mockResolvedValue({
        id: 'reg-1',
        userId: SHADOW_USER_ID,
        eventId: EVENT_ID,
        status: 'pending',
        cpf: '52998224725',
      });
    };

    it('fluxo completo: inscrição pending + PIX gerado com amount da forma de pagamento', async () => {
      setup();

      const result = await service.register(SLUG, baseDto);

      expect(result.status).toBe('pending');
      expect(result.qrCodeBase64).toBe('base64==');
      expect(result.qrCodeCopiaECola).toBe('0002...');
      expect(mockPayments.createPixForRegistration).toHaveBeenCalledWith(
        'reg-1',
        SHADOW_USER_ID,
        99.9,
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

    it('inscrição gratuita (R$0): status confirmed, sem PIX, email enviado', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.eventPaymentMethod.findUnique.mockResolvedValue({ ...basePaymentMethod, value: 0 });
      mockDb.registration.findFirst.mockResolvedValue(null);
      mockDb.registration.count.mockResolvedValue(0);
      mockDb.user.findUnique.mockResolvedValue(baseUser);
      mockDb.registration.create.mockResolvedValue({
        id: 'reg-free', userId: SHADOW_USER_ID, eventId: EVENT_ID, status: 'confirmed', cpf: '52998224725',
      });
      mockDb.registration.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.register(SLUG, baseDto);

      expect(result.status).toBe('confirmed');
      expect(mockPayments.createPixForRegistration).not.toHaveBeenCalled();
      expect(mockMail.sendRegistrationConfirmation).toHaveBeenCalledTimes(1);
    });

    it('lança NotFoundException para evento inexistente ou não publicado', async () => {
      mockDb.event.findUnique.mockResolvedValue(null);
      await expect(service.register(SLUG, baseDto)).rejects.toThrow(NotFoundException);
    });

    it('lança BadRequestException quando evento já aconteceu', async () => {
      mockDb.event.findUnique.mockResolvedValue({ ...baseEvent, date: pastDate });
      await expect(service.register(SLUG, baseDto)).rejects.toThrow(BadRequestException);
    });

    it('lança NotFoundException para forma de pagamento inexistente', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.eventPaymentMethod.findUnique.mockResolvedValue(null);
      await expect(service.register(SLUG, baseDto)).rejects.toThrow(NotFoundException);
    });

    it('lança BadRequestException para forma de pagamento de outro evento', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.eventPaymentMethod.findUnique.mockResolvedValue({ ...basePaymentMethod, eventId: 'outro' });
      await expect(service.register(SLUG, baseDto)).rejects.toThrow(BadRequestException);
    });

    it('lança ConflictException quando evento lotado (maxParticipants)', async () => {
      mockDb.event.findUnique.mockResolvedValue({ ...baseEvent, maxParticipants: 5 });
      mockDb.eventPaymentMethod.findUnique.mockResolvedValue(basePaymentMethod);
      mockDb.registration.findFirst.mockResolvedValue(null);
      mockDb.registration.count.mockResolvedValue(5);

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
        mockDb.eventPaymentMethod.findUnique.mockResolvedValue(basePaymentMethod);
        mockDb.registration.findFirst
          .mockResolvedValueOnce(null) // alreadyConfirmed check
          .mockResolvedValueOnce({ id: 'reg-old', cpf: '52998224725', status: 'pending', payment: existingPayment });

        const result = await service.register(SLUG, baseDto);

        expect(mockDb.registration.create).not.toHaveBeenCalled();
        expect(mockPayments.createPixForRegistration).not.toHaveBeenCalled();
        expect(result.registrationId).toBe('reg-old');
        expect((result as { reused?: boolean }).reused).toBe(true);
      });

      it('cria nova inscrição quando PIX anterior já expirou', async () => {
        mockDb.event.findUnique.mockResolvedValue(baseEvent);
        mockDb.eventPaymentMethod.findUnique.mockResolvedValue(basePaymentMethod);
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
