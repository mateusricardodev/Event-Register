import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentsService } from '../payments/payments.service.js';
import { generateUniqueRegistrationCode } from '../common/registration-code.js';
import { PublicRegistrationDto } from './dto/public-registration.dto.js';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payments: PaymentsService,
  ) {}

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

    if (!event || !event.isPublished) throw new NotFoundException('Evento não encontrado');

    const tickets = event.tickets.map(({ _count, quantity, ...t }) => ({
      ...t,
      quantity,
      available: Math.max(0, quantity - _count.registrations),
    }));

    return { ...event, tickets };
  }

  async getPaymentStatus(registrationId: string) {
    const registration = await this.prisma.db.registration.findUnique({
      where: { id: registrationId },
      select: { status: true, payment: { select: { status: true } } },
    });
    if (!registration) throw new NotFoundException('Inscrição não encontrada');
    return {
      status: registration.status,
      paymentStatus: registration.payment?.status ?? null,
    };
  }

  async register(slug: string, dto: PublicRegistrationDto) {
    const normalizedCpf = dto.cpf.replace(/\D/g, '');

    const event = await this.prisma.db.event.findUnique({
      where: { slug },
      select: { id: true, title: true, isPublished: true, date: true, location: true, maxParticipants: true },
    });

    if (!event || !event.isPublished) throw new NotFoundException('Evento não encontrado');
    if (new Date() > event.date)
      throw new BadRequestException('As inscrições para este evento estão encerradas');

    const ticket = await this.prisma.db.ticket.findUnique({ where: { id: dto.ticketId } });
    if (!ticket) throw new NotFoundException('Ingresso não encontrado');
    if (ticket.eventId !== event.id)
      throw new BadRequestException('Ingresso não pertence a este evento');

    // Anti-duplicidade: mesmo CPF com cobrança pendente ainda válida → reutiliza
    const existing = await this.prisma.db.registration.findFirst({
      where: {
        eventId: event.id,
        cpf: normalizedCpf,
        status: 'pending',
        payment: { status: 'pending', expiresAt: { gt: new Date() } },
      },
      include: {
        payment: {
          select: {
            id: true,
            providerPaymentId: true,
            qrCodeBase64: true,
            qrCodeCopiaECola: true,
            expiresAt: true,
            amount: true,
          },
        },
      },
    });

    if (existing?.payment) {
      return {
        registrationId: existing.id,
        paymentId: existing.payment.id,
        providerPaymentId: existing.payment.providerPaymentId,
        qrCodeBase64: existing.payment.qrCodeBase64,
        qrCodeCopiaECola: existing.payment.qrCodeCopiaECola,
        expiresAt: existing.payment.expiresAt,
        amount: existing.payment.amount,
        status: 'pending' as const,
        reused: true,
      };
    }

    // Cria inscrição dentro de transação serializável para garantir consistência de estoque
    const registration = await this.prisma.db.$transaction(async (tx) => {
      const used = await tx.registration.count({
        where: { ticketId: ticket.id, status: { not: 'canceled' } },
      });
      if (used >= ticket.quantity)
        throw new ConflictException('Ingressos esgotados para este tipo');

      if (event.maxParticipants !== null) {
        const total = await tx.registration.count({
          where: { eventId: event.id, status: { not: 'canceled' } },
        });
        if (total >= event.maxParticipants!)
          throw new ConflictException('Evento lotado');
      }

      // Usuário "sombra" — participante sem conta, vinculado por email
      let user = await tx.user.findUnique({ where: { email: dto.email } });
      if (!user) {
        const randomPassword = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
        user = await tx.user.create({
          data: { name: dto.fullName, email: dto.email, password: randomPassword },
        });
      }

      const code = await generateUniqueRegistrationCode(tx);

      return tx.registration.create({
        data: {
          userId: user.id,
          eventId: event.id,
          ticketId: ticket.id,
          status: 'pending',
          cpf: normalizedCpf,
          phone: dto.phone ?? null,
          extraFields: dto.extraFields ? JSON.stringify(dto.extraFields) : null,
          code,
        },
      });
    }, { isolationLevel: 'Serializable' as never });

    // Gera PIX usando o userId do shadow user (passa no ownership check)
    const pix = await this.payments.createPixForRegistration(
      registration.id,
      registration.userId,
    );

    return {
      registrationId: registration.id,
      ...pix,
      status: 'pending' as const,
    };
  }
}
