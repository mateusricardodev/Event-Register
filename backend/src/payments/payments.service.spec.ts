import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { IPaymentProvider, PixPaymentResult } from './providers/payment-provider.interface.js';
import { PAYMENT_PROVIDER_TOKEN } from './providers/payment-provider.factory.js';

const mockDb = {
  registration: { findUnique: jest.fn() },
  payment: { create: jest.fn(), delete: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
  $transaction: jest.fn(),
};
const mockPrisma = { db: mockDb };

const mockPixResult: PixPaymentResult = {
  providerPaymentId: 'mock_abc-123',
  qrCodeBase64: 'base64img==',
  qrCodeCopiaECola: '0002...copia',
  expiresAt: new Date('2099-01-01'),
};

const mockProvider: IPaymentProvider = {
  createPixPayment: jest.fn().mockResolvedValue(mockPixResult),
  getPaymentStatus: jest.fn(),
};

const USER_ID = 'user-uuid';
const REG_ID = 'reg-uuid';
const EVENT_ID = 'event-uuid';
const TICKET_ID = 'ticket-uuid';

const baseRegistration = {
  id: REG_ID,
  userId: USER_ID,
  eventId: EVENT_ID,
  ticketId: TICKET_ID,
  cpf: '12345678900',
  status: 'pending',
  ticket: { id: TICKET_ID, name: 'Inteira', price: 50 },
  event: { id: EVENT_ID, title: 'Congresso 2026' },
  user: { id: USER_ID, name: 'João', email: 'joao@email.com' },
  payment: null,
};

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PAYMENT_PROVIDER_TOKEN, useValue: mockProvider },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  describe('createPixForRegistration', () => {
    it('calcula o amount a partir do ticket no banco — nunca do cliente', async () => {
      mockDb.registration.findUnique.mockResolvedValue(baseRegistration);
      mockDb.payment.create.mockResolvedValue({
        id: 'pay-1',
        amount: 50,
        status: 'pending',
        expiresAt: mockPixResult.expiresAt,
      });

      const result = await service.createPixForRegistration(REG_ID, USER_ID);

      expect(result.amount).toBe(50);
      // O provider recebe o preço do banco, não um valor externo
      expect(mockProvider.createPixPayment).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 50 }),
      );
    });

    it('retorna qrCodeBase64, qrCodeCopiaECola e expiresAt', async () => {
      mockDb.registration.findUnique.mockResolvedValue(baseRegistration);
      mockDb.payment.create.mockResolvedValue({ id: 'pay-1', amount: 50, expiresAt: mockPixResult.expiresAt });

      const result = await service.createPixForRegistration(REG_ID, USER_ID);

      expect(result.qrCodeBase64).toBe('base64img==');
      expect(result.qrCodeCopiaECola).toBe('0002...copia');
      expect(result.expiresAt).toEqual(new Date('2099-01-01'));
    });

    it('lança NotFoundException para inscrição inexistente', async () => {
      mockDb.registration.findUnique.mockResolvedValue(null);

      await expect(service.createPixForRegistration(REG_ID, USER_ID))
        .rejects.toThrow(NotFoundException);
      expect(mockProvider.createPixPayment).not.toHaveBeenCalled();
    });

    it('lança ForbiddenException quando inscrição pertence a outro usuário', async () => {
      mockDb.registration.findUnique.mockResolvedValue({ ...baseRegistration, userId: 'outro' });

      await expect(service.createPixForRegistration(REG_ID, USER_ID))
        .rejects.toThrow(ForbiddenException);
    });

    it('lança ConflictException quando pagamento já foi confirmado', async () => {
      mockDb.registration.findUnique.mockResolvedValue({
        ...baseRegistration,
        payment: { id: 'pay-old', status: 'paid' },
      });

      await expect(service.createPixForRegistration(REG_ID, USER_ID))
        .rejects.toThrow(ConflictException);
    });

    it('lança BadRequestException quando o ingresso é gratuito (price=0)', async () => {
      mockDb.registration.findUnique.mockResolvedValue({
        ...baseRegistration,
        ticket: { id: TICKET_ID, name: 'Free', price: 0 },
      });

      await expect(service.createPixForRegistration(REG_ID, USER_ID))
        .rejects.toThrow(BadRequestException);
    });

    it('apaga pagamento pendente anterior e cria novo (retry)', async () => {
      const existingPending = { id: 'pay-old', status: 'pending' };
      mockDb.registration.findUnique.mockResolvedValue({
        ...baseRegistration,
        payment: existingPending,
      });
      mockDb.payment.delete.mockResolvedValue({});
      mockDb.payment.create.mockResolvedValue({ id: 'pay-new', amount: 50, expiresAt: mockPixResult.expiresAt });

      await service.createPixForRegistration(REG_ID, USER_ID);

      expect(mockDb.payment.delete).toHaveBeenCalledWith({ where: { id: 'pay-old' } });
      expect(mockDb.payment.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmPayment — idempotência', () => {
    it('fluxo completo: confirma pagamento e muda status da inscrição', async () => {
      const payment = { id: 'pay-1', registrationId: REG_ID };
      mockDb.$transaction.mockImplementation(async (fn: (tx: typeof mockDb) => Promise<void>) => {
        mockDb.payment.findFirst.mockResolvedValue(payment);
        mockDb.payment.update.mockResolvedValue({});
        mockDb.registration.update = jest.fn().mockResolvedValue({});
        await fn(mockDb);
      });

      await expect(service.confirmPayment('mock_abc-123')).resolves.toBeUndefined();
      expect(mockDb.$transaction).toHaveBeenCalledTimes(1);
    });

    it('é idempotente: segunda chamada não altera o pagamento já confirmado', async () => {
      mockDb.$transaction.mockImplementation(async (fn: (tx: typeof mockDb) => Promise<void>) => {
        // findFirst retorna null = pagamento já está paid (not in { not: 'paid' })
        mockDb.payment.findFirst.mockResolvedValue(null);
        mockDb.payment.update.mockResolvedValue({});
        mockDb.registration.update = jest.fn().mockResolvedValue({});
        await fn(mockDb);
      });

      await service.confirmPayment('mock_abc-123');
      await service.confirmPayment('mock_abc-123'); // segunda vez

      expect(mockDb.$transaction).toHaveBeenCalledTimes(2);
      // update do payment não é chamado porque findFirst retornou null
      expect(mockDb.payment.update).not.toHaveBeenCalled();
    });
  });

  describe('fluxo mock ponta-a-ponta', () => {
    it('cria PIX (pending) → confirma → Payment=paid e Registration=confirmed', async () => {
      // 1. Criar PIX
      mockDb.registration.findUnique.mockResolvedValue(baseRegistration);
      mockDb.payment.create.mockResolvedValue({
        id: 'pay-1',
        amount: 50,
        expiresAt: mockPixResult.expiresAt,
        providerPaymentId: 'mock_abc-123',
        status: 'pending',
      });

      const pixResult = await service.createPixForRegistration(REG_ID, USER_ID);
      expect(pixResult.qrCodeBase64).toBeDefined();
      expect(pixResult.qrCodeCopiaECola).toBeDefined();

      // 2. Simular aprovação via confirmPayment (mesmo fluxo que o webhook/mock-approve dispara)
      const payment = { id: 'pay-1', registrationId: REG_ID };
      mockDb.$transaction.mockImplementation(async (fn: (tx: typeof mockDb) => Promise<void>) => {
        mockDb.payment.findFirst.mockResolvedValue(payment);
        mockDb.payment.update.mockResolvedValue({ ...payment, status: 'paid' });
        mockDb.registration.update = jest.fn().mockResolvedValue({ id: REG_ID, status: 'confirmed' });
        await fn(mockDb);
      });

      await service.confirmPayment('mock_abc-123');

      expect(mockDb.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'paid' } }),
      );
      expect(mockDb.registration.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'confirmed' } }),
      );
    });
  });
});
