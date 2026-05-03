import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePaymentDto) {
    const registration = await this.prisma.db.registration.findUnique({
      where: { id: dto.registrationId },
      include: { ticket: true, payment: true },
    });

    if (!registration) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    if (registration.userId !== userId) {
      throw new ForbiddenException('Esta inscrição não pertence a você');
    }

    if (registration.payment) {
      throw new ConflictException('Esta inscrição já possui um pagamento');
    }

    const [payment] = await this.prisma.db.$transaction([
      this.prisma.db.payment.create({
        data: {
          registrationId: registration.id,
          amount: registration.ticket.price,
          status: 'paid',
          provider: 'mock',
        },
      }),
      this.prisma.db.registration.update({
        where: { id: registration.id },
        data: { status: 'confirmed' },
      }),
    ]);

    return {
      ...payment,
      registration: {
        id: registration.id,
        status: 'confirmed',
        eventId: registration.eventId,
        ticketId: registration.ticketId,
      },
    };
  }
}
