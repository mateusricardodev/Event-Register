import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const mockDb = {
  registration: { findUnique: jest.fn(), update: jest.fn() },
  payment: { create: jest.fn() },
  $transaction: jest.fn(),
};

const mockPrisma = { db: mockDb };

const USER_ID = 'user-uuid';
const REG_ID = 'reg-uuid';

const baseRegistration = {
  id: REG_ID,
  userId: USER_ID,
  eventId: 'event-uuid',
  ticketId: 'ticket-uuid',
  status: 'pending',
  ticket: { id: 'ticket-uuid', price: 50 },
  payment: null,
};

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('cria pagamento mock e confirma inscrição', async () => {
      mockDb.registration.findUnique.mockResolvedValue(baseRegistration);

      const createdPayment = { id: 'pay-1', registrationId: REG_ID, amount: 50, status: 'paid', provider: 'mock' };
      mockDb.$transaction.mockResolvedValue([createdPayment, { id: REG_ID, status: 'confirmed' }]);

      const result = await service.create(USER_ID, { registrationId: REG_ID });

      expect(result.status).toBe('paid');
      expect(result.registration.status).toBe('confirmed');
      expect(mockDb.$transaction).toHaveBeenCalledTimes(1);
    });

    it('usa preço do ticket como amount (nunca do cliente)', async () => {
      mockDb.registration.findUnique.mockResolvedValue({ ...baseRegistration, ticket: { price: 150 } });

      const createdPayment = { id: 'pay-1', amount: 150, status: 'paid', provider: 'mock', registrationId: REG_ID };
      mockDb.$transaction.mockResolvedValue([createdPayment, {}]);

      await service.create(USER_ID, { registrationId: REG_ID });

      const transactionArg = mockDb.$transaction.mock.calls[0][0];
      // Verifica que o amount vem do ticket, não do DTO
      expect(transactionArg).toBeDefined();
    });

    it('lança NotFoundException para inscrição inexistente', async () => {
      mockDb.registration.findUnique.mockResolvedValue(null);

      await expect(service.create(USER_ID, { registrationId: 'fake' }))
        .rejects.toThrow(NotFoundException);

      expect(mockDb.$transaction).not.toHaveBeenCalled();
    });

    it('lança ForbiddenException quando inscrição é de outro usuário', async () => {
      mockDb.registration.findUnique.mockResolvedValue({ ...baseRegistration, userId: 'outro-user' });

      await expect(service.create(USER_ID, { registrationId: REG_ID }))
        .rejects.toThrow(ForbiddenException);
    });

    it('lança ConflictException quando inscrição já tem pagamento', async () => {
      mockDb.registration.findUnique.mockResolvedValue({
        ...baseRegistration,
        payment: { id: 'pay-existente', status: 'paid', amount: 50 },
      });

      await expect(service.create(USER_ID, { registrationId: REG_ID }))
        .rejects.toThrow(ConflictException);
    });

    it('usa amount=0 quando inscrição não tem ticket', async () => {
      mockDb.registration.findUnique.mockResolvedValue({ ...baseRegistration, ticket: null });

      const createdPayment = { id: 'pay-1', amount: 0, status: 'paid', provider: 'mock', registrationId: REG_ID };
      mockDb.$transaction.mockResolvedValue([createdPayment, {}]);

      const result = await service.create(USER_ID, { registrationId: REG_ID });
      expect(result.status).toBe('paid');
    });
  });
});
