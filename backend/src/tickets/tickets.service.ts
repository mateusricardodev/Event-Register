import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(eventId: string) {
    await this.checkEventExists(eventId);

    return this.prisma.db.ticket.findMany({
      where: { eventId },
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { registrations: true } },
      },
    });
  }

  async create(eventId: string, userId: string, dto: CreateTicketDto) {
    const event = await this.prisma.db.event.findUnique({ where: { id: eventId } });

    if (!event) throw new NotFoundException('Evento não encontrado');
    if (event.createdBy !== userId)
      throw new ForbiddenException('Apenas o criador pode adicionar tickets');

    return this.prisma.db.ticket.create({
      data: { ...dto, eventId },
    });
  }

  private async checkEventExists(eventId: string) {
    const event = await this.prisma.db.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Evento não encontrado');
  }
}
