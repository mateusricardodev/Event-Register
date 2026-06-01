import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RegistrationsService } from './registrations.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';

const mockDb = {
  event: { findUnique: jest.fn() },
  ticket: { findUnique: jest.fn() },
  registration: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const OWNER_ID = 'owner-uuid';

const mockPrisma = { db: mockDb };
const mockMail = { sendRegistrationConfirmation: jest.fn().mockResolvedValue(undefined) };

const EVENT_ID = 'event-uuid';
const TICKET_ID = 'ticket-uuid';
const USER_ID = 'user-uuid';

const baseEvent = {
  id: EVENT_ID,
  title: 'Conferência',
  slug: 'conf-2026',
  isPublished: true,
  maxParticipants: 100,
  date: new Date('2026-08-01'),
  location: 'São Paulo',
  createdBy: OWNER_ID,
};

const baseTicket = {
  id: TICKET_ID,
  eventId: EVENT_ID,
  name: 'Geral',
  price: 0,
  quantity: 50,
};

const baseUser = { id: USER_ID, name: 'João', email: 'joao@test.com' };

describe('RegistrationsService', () => {
  let service: RegistrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MailService, useValue: mockMail },
      ],
    }).compile();

    service = module.get<RegistrationsService>(RegistrationsService);
    jest.clearAllMocks();
  });

  // ─── create (com ticket) ────────────────────────────────────────────────────

  describe('create', () => {
    it('cria inscrição com ticket válido', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.ticket.findUnique.mockResolvedValue(baseTicket);
      mockDb.registration.count.mockResolvedValue(0); // 0 usados de 50
      mockDb.registration.create.mockResolvedValue({ id: 'r1', userId: USER_ID, eventId: EVENT_ID, ticketId: TICKET_ID });

      const result = await service.create(USER_ID, { eventId: EVENT_ID, ticketId: TICKET_ID });
      expect(result).toHaveProperty('id');
    });

    it('lança NotFoundException para evento inexistente', async () => {
      mockDb.event.findUnique.mockResolvedValue(null);

      await expect(service.create(USER_ID, { eventId: 'fake', ticketId: TICKET_ID }))
        .rejects.toThrow(NotFoundException);
    });

    it('lança NotFoundException para ticket inexistente', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.ticket.findUnique.mockResolvedValue(null);

      await expect(service.create(USER_ID, { eventId: EVENT_ID, ticketId: 'fake' }))
        .rejects.toThrow(NotFoundException);
    });

    it('lança BadRequestException quando ticket não pertence ao evento', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.ticket.findUnique.mockResolvedValue({ ...baseTicket, eventId: 'outro-evento' });

      await expect(service.create(USER_ID, { eventId: EVENT_ID, ticketId: TICKET_ID }))
        .rejects.toThrow(BadRequestException);
    });

    it('lança BadRequestException quando ingressos esgotados', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.ticket.findUnique.mockResolvedValue({ ...baseTicket, quantity: 10 });
      mockDb.registration.count.mockResolvedValue(10); // lotado

      await expect(service.create(USER_ID, { eventId: EVENT_ID, ticketId: TICKET_ID }))
        .rejects.toThrow(BadRequestException);
    });
  });

  // ─── createPublic ───────────────────────────────────────────────────────────

  describe('createPublic', () => {
    const dto = { name: 'Maria', email: 'maria@test.com', cpf: '12345678900' };

    it('cria inscrição pública com sucesso', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.registration.count.mockResolvedValue(0);
      mockDb.user.findUnique.mockResolvedValue(baseUser);
      mockDb.registration.create.mockResolvedValue({ id: 'r1', eventId: EVENT_ID });

      const result = await service.createPublic('conf-2026', dto);
      expect(result).toHaveProperty('id');
    });

    it('lança NotFoundException para slug inexistente', async () => {
      mockDb.event.findUnique.mockResolvedValue(null);

      await expect(service.createPublic('inexistente', dto)).rejects.toThrow(NotFoundException);
    });

    it('lança BadRequestException para evento não publicado', async () => {
      mockDb.event.findUnique.mockResolvedValue({ ...baseEvent, isPublished: false });

      await expect(service.createPublic('conf-2026', dto)).rejects.toThrow(BadRequestException);
    });

    it('lança BadRequestException quando evento está lotado', async () => {
      mockDb.event.findUnique.mockResolvedValue({ ...baseEvent, maxParticipants: 5 });
      mockDb.registration.count.mockResolvedValue(5);

      await expect(service.createPublic('conf-2026', dto)).rejects.toThrow(BadRequestException);
    });

    it('cria novo usuário quando email não existe no sistema', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.registration.count.mockResolvedValue(0);
      mockDb.user.findUnique.mockResolvedValue(null); // usuário não existe
      mockDb.user.create.mockResolvedValue({ id: 'new-user', ...dto });
      mockDb.registration.create.mockResolvedValue({ id: 'r1', eventId: EVENT_ID });

      await service.createPublic('conf-2026', dto);
      expect(mockDb.user.create).toHaveBeenCalledTimes(1);
    });

    it('envia email de confirmação de forma assíncrona', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.registration.count.mockResolvedValue(0);
      mockDb.user.findUnique.mockResolvedValue(baseUser);
      mockDb.registration.create.mockResolvedValue({ id: 'r1', eventId: EVENT_ID });

      await service.createPublic('conf-2026', dto);

      // Aguarda microtask do void sendRegistrationConfirmation
      await Promise.resolve();
      expect(mockMail.sendRegistrationConfirmation).toHaveBeenCalledWith(
        expect.objectContaining({ participantEmail: dto.email, eventTitle: baseEvent.title }),
      );
    });

    // ─── PROVA DO BUG C-01: Race condition ────────────────────────────────────
    it('BUG C-01 (race condition): permite N+1 inscrições em evento com 1 vaga', async () => {
      const eventWith1Vaga = { ...baseEvent, maxParticipants: 1 };
      mockDb.event.findUnique.mockResolvedValue(eventWith1Vaga);
      mockDb.user.findUnique.mockResolvedValue(baseUser);

      // Ambas as chamadas simultâneas leem count=0 (antes de qualquer create persistido)
      mockDb.registration.count.mockResolvedValue(0);
      mockDb.registration.create
        .mockResolvedValueOnce({ id: 'r1' })
        .mockResolvedValueOnce({ id: 'r2' });

      // Dispara duas inscrições simultâneas
      const [res1, res2] = await Promise.all([
        service.createPublic('conf-2026', { ...dto, email: 'a@test.com' }),
        service.createPublic('conf-2026', { ...dto, email: 'b@test.com' }),
      ]);

      // AMBAS retornam sucesso — o evento está lotado mas as duas inscrições foram criadas
      // Este teste FALHA após a correção com transação Serializable (apenas 1 deve passar)
      expect(res1).toHaveProperty('id', 'r1');
      expect(res2).toHaveProperty('id', 'r2');
      expect(mockDb.registration.create).toHaveBeenCalledTimes(2); // BUG: deveria ser 1
    });
  });

  // ─── findByEvent ────────────────────────────────────────────────────────────

  describe('findByEvent', () => {
    it('retorna inscrições quando é o dono do evento', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.registration.findMany.mockResolvedValue([{ id: 'r1' }]);

      const result = await service.findByEvent(EVENT_ID, OWNER_ID);
      expect(result).toHaveLength(1);
    });

    it('lança ForbiddenException quando não é o dono do evento', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);

      await expect(service.findByEvent(EVENT_ID, 'outro-user')).rejects.toThrow(ForbiddenException);
      expect(mockDb.registration.findMany).not.toHaveBeenCalled();
    });

    it('lança NotFoundException para evento inexistente', async () => {
      mockDb.event.findUnique.mockResolvedValue(null);

      await expect(service.findByEvent('fake', OWNER_ID)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── createByOrganizer ──────────────────────────────────────────────────────

  describe('createByOrganizer', () => {
    const dto = { name: 'José', email: 'jose@test.com', cpf: '00000000000' };

    it('cria inscrição manual com sucesso', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);
      mockDb.registration.count.mockResolvedValue(0);
      mockDb.user.findUnique.mockResolvedValue(baseUser);
      mockDb.registration.create.mockResolvedValue({ id: 'r1', userId: USER_ID, eventId: EVENT_ID });

      const result = await service.createByOrganizer(EVENT_ID, OWNER_ID, dto);
      expect(result).toHaveProperty('id');
    });

    it('lança ForbiddenException quando não é o dono do evento', async () => {
      mockDb.event.findUnique.mockResolvedValue(baseEvent);

      await expect(service.createByOrganizer(EVENT_ID, 'outro-user', dto))
        .rejects.toThrow(ForbiddenException);
    });

    it('lança BadRequestException quando evento lotado', async () => {
      mockDb.event.findUnique.mockResolvedValue({ ...baseEvent, maxParticipants: 1 });
      mockDb.registration.count.mockResolvedValue(1);

      await expect(service.createByOrganizer(EVENT_ID, OWNER_ID, dto)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    const reg = { id: 'r1', userId: USER_ID, user: baseUser, event: { createdBy: OWNER_ID } };

    it('atualiza dados da inscrição quando é o dono do evento', async () => {
      mockDb.registration.findUnique.mockResolvedValue(reg);
      mockDb.user.update.mockResolvedValue({});
      mockDb.registration.update.mockResolvedValue({ ...reg, cpf: '99999999999' });

      const result = await service.update('r1', OWNER_ID, { name: 'Novo nome', cpf: '99999999999' });
      expect(mockDb.registration.update).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('cpf', '99999999999');
    });

    it('lança ForbiddenException quando não é o dono do evento', async () => {
      mockDb.registration.findUnique.mockResolvedValue(reg);

      await expect(service.update('r1', 'outro-user', { cpf: '99999999999' }))
        .rejects.toThrow(ForbiddenException);
      expect(mockDb.registration.update).not.toHaveBeenCalled();
    });

    it('lança NotFoundException para inscrição inexistente', async () => {
      mockDb.registration.findUnique.mockResolvedValue(null);

      await expect(service.update('fake', OWNER_ID, { cpf: '12345678900' })).rejects.toThrow(NotFoundException);
    });
  });

  // ─── cancel ─────────────────────────────────────────────────────────────────

  describe('cancel', () => {
    it('cancela inscrição quando é o dono do evento', async () => {
      mockDb.registration.findUnique.mockResolvedValue({ id: 'r1', status: 'confirmed', event: { createdBy: OWNER_ID } });
      mockDb.registration.update.mockResolvedValue({ id: 'r1', status: 'canceled' });

      const result = await service.cancel('r1', OWNER_ID);
      expect(result.status).toBe('canceled');
    });

    it('lança ForbiddenException quando não é o dono do evento', async () => {
      mockDb.registration.findUnique.mockResolvedValue({ id: 'r1', status: 'confirmed', event: { createdBy: OWNER_ID } });

      await expect(service.cancel('r1', 'outro-user')).rejects.toThrow(ForbiddenException);
      expect(mockDb.registration.update).not.toHaveBeenCalled();
    });

    it('lança NotFoundException para inscrição inexistente', async () => {
      mockDb.registration.findUnique.mockResolvedValue(null);
      await expect(service.cancel('fake', OWNER_ID)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── search ─────────────────────────────────────────────────────────────────

  describe('search', () => {
    it('retorna resultados para query válida', async () => {
      const regs = [{ id: 'r1', user: baseUser }];
      mockDb.registration.findMany.mockResolvedValue(regs);

      const result = await service.search('joão');
      expect(result).toEqual(regs);
    });

    it('retorna array vazio para query com menos de 2 caracteres', async () => {
      const result = await service.search('j');
      expect(result).toEqual([]);
      expect(mockDb.registration.findMany).not.toHaveBeenCalled();
    });

    it('retorna array vazio para query em branco', async () => {
      const result = await service.search('');
      expect(result).toEqual([]);
    });
  });
});
