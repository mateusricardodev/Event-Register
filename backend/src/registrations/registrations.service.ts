import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
import { CreateRegistrationOrganizerDto } from './dto/create-registration-organizer.dto.js';
import { UpdateRegistrationDto } from './dto/update-registration.dto.js';
import { generateUniqueRegistrationCode } from '../common/registration-code.js';

@Injectable()
export class RegistrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(userId: string, dto: CreateRegistrationDto) {
    const event = await this.prisma.db.event.findUnique({ where: { id: dto.eventId } });
    if (!event) throw new NotFoundException('Evento não encontrado');

    const ticket = await this.prisma.db.ticket.findUnique({ where: { id: dto.ticketId } });
    if (!ticket) throw new NotFoundException('Ticket não encontrado');
    if (ticket.eventId !== dto.eventId)
      throw new BadRequestException('Ticket não pertence a este evento');

    return this.prisma.db.$transaction(async (tx) => {
      const used = await tx.registration.count({
        where: { ticketId: dto.ticketId, status: { not: 'canceled' } },
      });
      if (used >= ticket.quantity)
        throw new BadRequestException('Ingressos esgotados para este ticket');

      const code = await generateUniqueRegistrationCode(tx);
      return tx.registration.create({
        data: { userId, eventId: dto.eventId, ticketId: dto.ticketId, code },
        include: {
          event: { select: { id: true, title: true, date: true } },
          ticket: { select: { id: true, name: true, price: true } },
        },
      });
    }, { isolationLevel: 'Serializable' as never });
  }

  async findMyRegistrations(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.db.registration.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          event: { select: { id: true, title: true, date: true, location: true } },
          ticket: { select: { id: true, name: true, price: true } },
          payment: { select: { id: true, status: true, amount: true } },
        },
      }),
      this.prisma.db.registration.count({ where: { userId } }),
    ]);
    return { data, total, page, limit };
  }

  async findByEvent(eventId: string, userId: string, page = 1, limit = 50) {
    const event = await this.prisma.db.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Evento não encontrado');
    if (event.createdBy !== userId)
      throw new ForbiddenException('Sem permissão para acessar estas inscrições');

    limit = Math.min(Math.max(limit, 1), 1000);
    const skip = (Math.max(page, 1) - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.db.registration.findMany({
        where: { eventId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          ticket: { select: { id: true, name: true, price: true } },
          payment: { select: { id: true, status: true, amount: true } },
        },
      }),
      this.prisma.db.registration.count({ where: { eventId } }),
    ]);
    return { data, total, page, limit };
  }

  async createByOrganizer(eventId: string, userId: string, dto: CreateRegistrationOrganizerDto) {
    const event = await this.prisma.db.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Evento não encontrado');
    if (event.createdBy !== userId)
      throw new ForbiddenException('Sem permissão para adicionar inscrições a este evento');

    // Normaliza para só dígitos — o dedup por evento depende de formato único
    const normalizedCpf = dto.cpf.replace(/\D/g, '');

    const registration = await this.prisma.db.$transaction(async (tx) => {
      if (event.maxParticipants) {
        const count = await tx.registration.count({
          where: { eventId, status: { not: 'canceled' } },
        });
        if (count >= event.maxParticipants)
          throw new BadRequestException('Evento lotado');
      }

      const duplicate = await tx.registration.findFirst({
        where: { eventId, cpf: normalizedCpf, status: { not: 'canceled' } },
      });
      if (duplicate)
        throw new BadRequestException('CPF já inscrito neste evento');

      let user = await tx.user.findUnique({ where: { email: dto.email } });
      if (!user) {
        const randomPassword = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
        user = await tx.user.create({
          data: { name: dto.name, email: dto.email, password: randomPassword },
        });
      }

      const code = await generateUniqueRegistrationCode(tx);
      return tx.registration.create({
        data: {
          userId: user.id,
          eventId,
          status: 'confirmed',
          cpf: normalizedCpf,
          phone: dto.phone,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
          code,
        },
        include: { user: { select: { id: true, name: true, email: true } } },
      });
    }, { isolationLevel: 'Serializable' as never });

    void this.mail.sendRegistrationConfirmation({
      participantName: dto.name,
      participantEmail: dto.email,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      registrationId: registration.id,
      registrationCode: registration.code,
    });

    return registration;
  }

  async update(id: string, userId: string, dto: UpdateRegistrationDto) {
    const registration = await this.prisma.db.registration.findUnique({
      where: { id },
      include: { user: true, event: true },
    });
    if (!registration) throw new NotFoundException('Inscrição não encontrada');
    if (registration.event.createdBy !== userId)
      throw new ForbiddenException('Sem permissão para editar esta inscrição');

    if (dto.name) {
      await this.prisma.db.user.update({
        where: { id: registration.userId },
        data: { name: dto.name },
      });
    }

    return this.prisma.db.registration.update({
      where: { id },
      data: {
        ...(dto.cpf && { cpf: dto.cpf.replace(/\D/g, '') }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.birthDate !== undefined && {
          birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        }),
        ...(dto.ticketId && { ticketId: dto.ticketId }),
        ...(dto.extraFields !== undefined && {
          extraFields: JSON.stringify(dto.extraFields),
        }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        ticket: { select: { id: true, name: true, price: true } },
        payment: { select: { id: true, status: true, amount: true } },
      },
    });
  }

  async cancel(id: string, userId: string) {
    const registration = await this.prisma.db.registration.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!registration) throw new NotFoundException('Inscrição não encontrada');
    if (registration.event.createdBy !== userId)
      throw new ForbiddenException('Sem permissão para cancelar esta inscrição');

    return this.prisma.db.registration.update({
      where: { id },
      data: { status: 'canceled' },
    });
  }

  async search(q: string, userId: string) {
    if (!q || q.trim().length < 2) return [];

    return this.prisma.db.registration.findMany({
      where: {
        event: { createdBy: userId },
        OR: [
          { user: { name: { contains: q, mode: 'insensitive' } } },
          { user: { email: { contains: q, mode: 'insensitive' } } },
          { cpf: { contains: q } },
          { id: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { id: true, name: true, email: true } },
        ticket: { select: { id: true, name: true, price: true } },
        event: { select: { id: true, title: true } },
        payment: { select: { id: true, status: true, amount: true } },
      },
    });
  }
}
