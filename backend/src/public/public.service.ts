import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async findEventBySlug(slug: string) {
    const event = await this.prisma.db.event.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        description: true,
        about: true,
        location: true,
        date: true,
        endDate: true,
        bannerUrl: true,
        slug: true,
        category: true,
        maxParticipants: true,
        organizerPhone: true,
        isPublished: true,
        formFields: true,
        tickets: {
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
            _count: {
              select: { registrations: { where: { status: { not: 'canceled' } } } },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        user: { select: { name: true } },
      },
    });

    if (!event) throw new NotFoundException('Evento não encontrado');
    if (!event.isPublished) throw new NotFoundException('Evento não encontrado');

    const tickets = event.tickets.map(({ _count, quantity, ...t }) => ({
      ...t,
      quantity,
      available: Math.max(0, quantity - _count.registrations),
    }));

    return { ...event, tickets };
  }
}
