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
import { MailService } from '../mail/mail.service.js';
import { generateUniqueRegistrationCode } from '../common/registration-code.js';
import { PublicRegistrationDto } from './dto/public-registration.dto.js';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payments: PaymentsService,
    private readonly mail: MailService,
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
        paymentMethods: {
          select: { id: true, type: true, value: true, installments: true },
          orderBy: { createdAt: 'asc' },
        },
        user: { select: { name: true } },
      },
    });

    if (!event || !event.isPublished) throw new NotFoundException('Evento não encontrado');

    return event;
  }

  async getPaymentStatus(registrationId: string) {
    const registration = await this.prisma.db.registration.findUnique({
      where: { id: registrationId },
      select: { status: true, payment: { select: { status: true, providerPaymentId: true } } },
    });
    if (!registration) throw new NotFoundException('Inscrição não encontrada');

    // Fallback do webhook: se ainda pendente, pergunta ao provider e reconcilia
    if (registration.payment?.status === 'pending' && registration.payment.providerPaymentId) {
      await this.payments.reconcileByProvider(registration.payment.providerPaymentId);
      const refreshed = await this.prisma.db.registration.findUnique({
        where: { id: registrationId },
        select: { status: true, payment: { select: { status: true } } },
      });
      if (refreshed) {
        return {
          status: refreshed.status,
          paymentStatus: refreshed.payment?.status ?? null,
        };
      }
    }

    return {
      status: registration.status,
      paymentStatus: registration.payment?.status ?? null,
    };
  }

  async register(slug: string, dto: PublicRegistrationDto) {
    const normalizedCpf = dto.cpf.replace(/\D/g, '');

    const event = await this.prisma.db.event.findUnique({
      where: { slug },
      select: { id: true, title: true, isPublished: true, date: true, endDate: true, location: true, maxParticipants: true },
    });

    if (!event || !event.isPublished) throw new NotFoundException('Evento não encontrado');
    // Inscrições abertas até o fim do evento (data de término, ou a de início se não houver término)
    if (new Date() > (event.endDate ?? event.date))
      throw new BadRequestException('As inscrições para este evento estão encerradas');

    const paymentMethod = await this.prisma.db.eventPaymentMethod.findUnique({
      where: { id: dto.paymentMethodId },
    });
    if (!paymentMethod) throw new NotFoundException('Forma de pagamento não encontrada');
    if (paymentMethod.eventId !== event.id)
      throw new BadRequestException('Forma de pagamento não pertence a este evento');

    const amount = Number(paymentMethod.value);

    // CPF já tem inscrição confirmada neste evento
    const alreadyConfirmed = await this.prisma.db.registration.findFirst({
      where: { eventId: event.id, cpf: normalizedCpf, status: 'confirmed' },
    });
    if (alreadyConfirmed)
      throw new ConflictException('Este CPF já possui inscrição confirmada neste evento');

    // Anti-duplicidade para PIX pendente: reutiliza o mesmo QR Code se ainda válido
    if (amount > 0) {
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
    }

    // Cria inscrição dentro de transação serializável
    const registration = await this.prisma.db.$transaction(async (tx) => {
      if (event.maxParticipants !== null) {
        const total = await tx.registration.count({
          where: { eventId: event.id, status: { not: 'canceled' } },
        });
        if (total >= event.maxParticipants!)
          throw new ConflictException('Evento lotado');
      }

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
          status: amount === 0 ? 'confirmed' : 'pending',
          cpf: normalizedCpf,
          phone: dto.phone ?? null,
          extraFields: dto.extraFields ? JSON.stringify(dto.extraFields) : null,
          code,
        },
      });
    }, { isolationLevel: 'Serializable' as never });

    // Inscrição gratuita: confirma direto e envia e-mail
    if (amount === 0) {
      const marked = await this.prisma.db.registration.updateMany({
        where: { id: registration.id, confirmationEmailSentAt: null },
        data: { confirmationEmailSentAt: new Date() },
      });
      if (marked.count > 0) {
        void this.mail.sendRegistrationConfirmation({
          participantName: dto.fullName,
          participantEmail: dto.email,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          registrationId: registration.id,
          amountPaid: 0,
        });
      }

      return {
        registrationId: registration.id,
        amount: 0,
        status: 'confirmed' as const,
      };
    }

    // Inscrição paga: gera PIX
    const pix = await this.payments.createPixForRegistration(
      registration.id,
      registration.userId,
      amount,
    );

    return {
      registrationId: registration.id,
      ...pix,
      status: 'pending' as const,
    };
  }
}
