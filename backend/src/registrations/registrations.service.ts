import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateRegistrationDto) {
    const event = await this.prisma.db.event.findUnique({
      where: { id: dto.eventId },
    });
    if (!event) throw new NotFoundException('Evento não encontrado');

    const ticket = await this.prisma.db.ticket.findUnique({
      where: { id: dto.ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket não encontrado');
    if (ticket.eventId !== dto.eventId)
      throw new BadRequestException('Ticket não pertence a este evento');

    const used = await this.prisma.db.registration.count({
      where: {
        ticketId: dto.ticketId,
        status: { not: 'canceled' },
      },
    });
    if (used >= ticket.quantity)
      throw new BadRequestException('Ingressos esgotados para este ticket');

    return this.prisma.db.registration.create({
      data: {
        userId,
        eventId: dto.eventId,
        ticketId: dto.ticketId,
      },
      include: {
        event: { select: { id: true, title: true, date: true } },
        ticket: { select: { id: true, name: true, price: true } },
      },
    });
  }

  async findMyRegistrations(userId: string) {
    return this.prisma.db.registration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: { select: { id: true, title: true, date: true, location: true } },
        ticket: { select: { id: true, name: true, price: true } },
        payment: { select: { id: true, status: true, amount: true } },
      },
    });
  }
}
