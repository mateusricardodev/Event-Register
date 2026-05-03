import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.db.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { tickets: true, registrations: true } },
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.db.event.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        tickets: true,
        _count: { select: { registrations: true } },
      },
    });

    if (!event) throw new NotFoundException('Evento não encontrado');

    return event;
  }

  async create(userId: string, dto: CreateEventDto) {
    return this.prisma.db.event.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        createdBy: userId,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateEventDto) {
    await this.checkOwnership(id, userId);

    return this.prisma.db.event.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.date && { date: new Date(dto.date) }),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.checkOwnership(id, userId);

    await this.prisma.db.event.delete({ where: { id } });

    return { message: 'Evento removido com sucesso' };
  }

  private async checkOwnership(id: string, userId: string) {
    const event = await this.prisma.db.event.findUnique({ where: { id } });

    if (!event) throw new NotFoundException('Evento não encontrado');
    if (event.createdBy !== userId)
      throw new ForbiddenException('Apenas o criador pode modificar este evento');
  }
}
