import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto.js';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.db.event.findMany({
      where: { createdBy: userId },
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
        user: { select: { id: true, name: true, email: true } },
        tickets: true,
        paymentMethods: { orderBy: { createdAt: 'asc' } },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) throw new NotFoundException('Evento não encontrado');

    return event;
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.db.event.findUnique({
      where: { slug },
      include: {
        user: { select: { id: true, name: true } },
        tickets: true,
        paymentMethods: true,
        _count: { select: { registrations: true } },
      },
    });

    if (!event) throw new NotFoundException('Evento não encontrado');

    return event;
  }

  async create(userId: string, dto: CreateEventDto) {
    if (dto.slug) {
      const existing = await this.prisma.db.event.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Esta URL já está em uso');
    }

    return this.prisma.db.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        date: new Date(dto.date),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        bannerUrl: dto.bannerUrl,
        slug: dto.slug,
        category: dto.category,
        maxParticipants: dto.maxParticipants,
        organizerPhone: dto.organizerPhone,
        about: dto.about,
        formFields: dto.formFields,
        createdBy: userId,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateEventDto) {
    await this.checkOwnership(id, userId);

    if (dto.slug) {
      const existing = await this.prisma.db.event.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      });
      if (existing) throw new ConflictException('Esta URL já está em uso');
    }

    return this.prisma.db.event.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.endDate !== undefined && { endDate: dto.endDate ? new Date(dto.endDate) : null }),
        ...(dto.bannerUrl !== undefined && { bannerUrl: dto.bannerUrl }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.maxParticipants !== undefined && { maxParticipants: dto.maxParticipants }),
        ...(dto.organizerPhone !== undefined && { organizerPhone: dto.organizerPhone }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
        ...(dto.about !== undefined && { about: dto.about }),
        ...(dto.formFields !== undefined && { formFields: dto.formFields }),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.checkOwnership(id, userId);

    const registrations = await this.prisma.db.registration.findMany({
      where: { eventId: id },
      select: { id: true },
    });
    const regIds = registrations.map((r) => r.id);

    await this.prisma.db.payment.deleteMany({ where: { registrationId: { in: regIds } } });
    await this.prisma.db.registration.deleteMany({ where: { eventId: id } });
    await this.prisma.db.eventPaymentMethod.deleteMany({ where: { eventId: id } });
    await this.prisma.db.ticket.deleteMany({ where: { eventId: id } });
    await this.prisma.db.event.delete({ where: { id } });

    return { message: 'Evento removido com sucesso' };
  }

  async addPaymentMethod(eventId: string, userId: string, dto: CreatePaymentMethodDto) {
    await this.checkOwnership(eventId, userId);

    return this.prisma.db.eventPaymentMethod.create({
      data: {
        eventId,
        type: dto.type,
        value: dto.value ?? 0,
        installments: dto.installments ?? 1,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async removePaymentMethod(eventId: string, methodId: string, userId: string) {
    await this.checkOwnership(eventId, userId);

    const method = await this.prisma.db.eventPaymentMethod.findFirst({
      where: { id: methodId, eventId },
    });
    if (!method) throw new NotFoundException('Modalidade não encontrada');

    await this.prisma.db.eventPaymentMethod.delete({ where: { id: methodId } });
    return { message: 'Modalidade removida' };
  }

  async getPaymentMethods(eventId: string) {
    return this.prisma.db.eventPaymentMethod.findMany({
      where: { eventId },
      orderBy: { createdAt: 'asc' },
    });
  }

  private async checkOwnership(id: string, userId: string) {
    const event = await this.prisma.db.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Evento não encontrado');
    if (event.createdBy !== userId)
      throw new ForbiddenException('Apenas o criador pode modificar este evento');
  }
}
