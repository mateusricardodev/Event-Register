import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CheckinService } from './checkin.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const mockDb: any = {
  event: { findUnique: jest.fn() },
  eventVolunteer: { findUnique: jest.fn() },
  registration: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
  },
  checkinLog: { create: jest.fn() },
  user: { findUnique: jest.fn() },
};

const mockPrisma = { db: mockDb };

const EVENT_ID = 'event-uuid';
const OWNER_ID = 'owner-uuid';
const VOLUNTEER_ID = 'vol-uuid';
const STRANGER_ID = 'stranger-uuid';
const REG_ID = 'reg-uuid';

const ownedEvent = { id: EVENT_ID, title: 'Aviva Jovem', createdBy: OWNER_ID };

function regRow(over: Record<string, unknown> = {}) {
  return {
    id: REG_ID,
    cpf: '36458532865',
    code: 'SRT-R1Z-XKE',
    checkedIn: false,
    checkedInAt: null,
    checkedInBy: null,
    status: 'confirmed',
    user: { id: 'u1', name: 'Ana Souza', email: 'ana@x.com' },
    ticket: { id: 't1', name: 'Normal', price: 0 },
    payment: { status: 'paid', provider: 'mock' },
    ...over,
  };
}

describe('CheckinService', () => {
  let service: CheckinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CheckinService>(CheckinService);
    jest.clearAllMocks();
  });

  describe('autorização', () => {
    it('permite o criador do evento', async () => {
      mockDb.event.findUnique.mockResolvedValue(ownedEvent);
      mockDb.registration.count.mockResolvedValue(0);
      await expect(service.stats(EVENT_ID, OWNER_ID)).resolves.toBeDefined();
      expect(mockDb.eventVolunteer.findUnique).not.toHaveBeenCalled();
    });

    it('permite voluntário vinculado', async () => {
      mockDb.event.findUnique.mockResolvedValue(ownedEvent);
      mockDb.eventVolunteer.findUnique.mockResolvedValue({ id: 'link' });
      mockDb.registration.count.mockResolvedValue(0);
      await expect(service.stats(EVENT_ID, VOLUNTEER_ID)).resolves.toBeDefined();
    });

    it('bloqueia quem não é criador nem voluntário (outra org)', async () => {
      mockDb.event.findUnique.mockResolvedValue(ownedEvent);
      mockDb.eventVolunteer.findUnique.mockResolvedValue(null);
      await expect(service.stats(EVENT_ID, STRANGER_ID)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('lança NotFound quando o evento não existe', async () => {
      mockDb.event.findUnique.mockResolvedValue(null);
      await expect(service.stats(EVENT_ID, OWNER_ID)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('checkIn (atômico / idempotente)', () => {
    it('credencia quando ainda não estava credenciado', async () => {
      mockDb.event.findUnique.mockResolvedValue(ownedEvent);
      mockDb.registration.updateMany.mockResolvedValue({ count: 1 });
      mockDb.registration.findFirst.mockResolvedValue(
        regRow({ checkedIn: true, checkedInBy: OWNER_ID }),
      );

      const res = await service.checkIn(EVENT_ID, REG_ID, OWNER_ID);

      expect(res.status).toBe('checked_in');
      // condição atômica: só atualiza se checkedIn=false
      expect(mockDb.registration.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ checkedIn: false }),
        }),
      );
      expect(mockDb.checkinLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'check_in' }),
        }),
      );
    });

    it('é idempotente: 2º voluntário não erra e recebe quem credenciou', async () => {
      mockDb.event.findUnique.mockResolvedValue(ownedEvent);
      mockDb.eventVolunteer.findUnique.mockResolvedValue({ id: 'link' });
      // update não afeta nenhuma linha (já estava credenciado)
      mockDb.registration.updateMany.mockResolvedValue({ count: 0 });
      mockDb.registration.findFirst.mockResolvedValue(
        regRow({ checkedIn: true, checkedInBy: OWNER_ID }),
      );
      mockDb.user.findUnique.mockResolvedValue({ name: 'João (1º voluntário)' });

      const res = await service.checkIn(EVENT_ID, REG_ID, VOLUNTEER_ID);

      expect(res.status).toBe('already');
      expect(res).toMatchObject({ checkedInByName: 'João (1º voluntário)' });
      expect(mockDb.checkinLog.create).not.toHaveBeenCalled();
    });
  });

  describe('findByCode', () => {
    it('normaliza o código e busca dentro do evento', async () => {
      mockDb.event.findUnique.mockResolvedValue(ownedEvent);
      mockDb.registration.findFirst.mockResolvedValue(regRow());

      const res = await service.findByCode(EVENT_ID, ' srt-r1z-xke ', OWNER_ID);

      expect(res.code).toBe('SRT-R1Z-XKE');
      expect(mockDb.registration.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { code: 'SRT-R1Z-XKE', eventId: EVENT_ID },
        }),
      );
    });

    it('lança NotFound para código inexistente', async () => {
      mockDb.event.findUnique.mockResolvedValue(ownedEvent);
      mockDb.registration.findFirst.mockResolvedValue(null);
      await expect(
        service.findByCode(EVENT_ID, 'XXX-XXX-XXX', OWNER_ID),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
