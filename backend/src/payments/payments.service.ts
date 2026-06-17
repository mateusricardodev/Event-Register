import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import type { IPaymentProvider } from './providers/payment-provider.interface.js';
import { PAYMENT_PROVIDER_TOKEN } from './providers/payment-provider.factory.js';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    @Inject(PAYMENT_PROVIDER_TOKEN) private readonly provider: IPaymentProvider,
  ) {}

  async createPixForRegistration(registrationId: string, userId: string, amount?: number) {
    const registration = await this.prisma.db.registration.findUnique({
      where: { id: registrationId },
      include: { event: true, user: true, payment: true },
    });

    if (!registration) throw new NotFoundException('Inscrição não encontrada');
    if (registration.userId !== userId)
      throw new ForbiddenException('Esta inscrição não pertence a você');
    if (registration.payment?.status === 'paid')
      throw new ConflictException('Pagamento já confirmado');

    // Amount: explicit (public flow) ou do pagamento anterior (retry autenticado)
    const effectiveAmount = amount ?? Number(registration.payment?.amount ?? 0);
    if (effectiveAmount <= 0)
      throw new ConflictException('Não foi possível determinar o valor do pagamento');

    // Discard any previous pending attempt so the user can retry
    if (registration.payment) {
      await this.prisma.db.payment.delete({ where: { id: registration.payment.id } });
    }

    const result = await this.provider.createPixPayment({
      registrationId,
      amount: effectiveAmount,
      payerName: registration.user.name,
      payerEmail: registration.user.email,
      payerCpf: registration.cpf ?? '',
      description: `${registration.event.title} — Inscrição`,
    });

    const payment = await this.prisma.db.payment.create({
      data: {
        registrationId,
        amount: effectiveAmount,
        status: 'pending',
        provider: process.env.PAYMENT_PROVIDER ?? 'mock',
        providerPaymentId: result.providerPaymentId,
        qrCodeBase64: result.qrCodeBase64,
        qrCodeCopiaECola: result.qrCodeCopiaECola,
        expiresAt: result.expiresAt,
      },
    });

    return {
      paymentId: payment.id,
      providerPaymentId: result.providerPaymentId,
      qrCodeBase64: result.qrCodeBase64,
      qrCodeCopiaECola: result.qrCodeCopiaECola,
      expiresAt: result.expiresAt,
      amount: effectiveAmount,
    };
  }

  async confirmPayment(providerPaymentId: string): Promise<void> {
    this.logger.log(`[webhook] Confirmando pagamento providerPaymentId=${providerPaymentId}`);
    const emailData = await this.prisma.db.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { providerPaymentId, status: { not: 'paid' } },
        include: {
          registration: {
            include: {
              ticket: { select: { id: true, name: true } },
              event: { select: { title: true, date: true, location: true } },
              user: { select: { name: true, email: true } },
            },
          },
        },
      });
      if (!payment) return null; // already confirmed — idempotent no-op

      const reg = payment.registration;
      let newStatus: 'confirmed' | 'overbooked' = 'confirmed';

      if (reg.ticketId) {
        const affected = await tx.$executeRaw`
          UPDATE "Ticket" SET sold = sold + 1
          WHERE id = ${reg.ticketId} AND sold < quantity
        `;
        if (affected === 0) {
          newStatus = 'overbooked';
          this.logger.warn(
            `[payment:${providerPaymentId}] Estoque esgotado — Registration ${reg.id} → overbooked`,
          );
        }
      }

      await tx.payment.update({ where: { id: payment.id }, data: { status: 'paid' } });
      await tx.registration.update({ where: { id: reg.id }, data: { status: newStatus } });

      if (newStatus !== 'confirmed') return null;

      return {
        registrationId: reg.id,
        participantName: reg.user.name,
        participantEmail: reg.user.email,
        eventTitle: reg.event.title,
        eventDate: reg.event.date,
        eventLocation: reg.event.location,
        ticketName: reg.ticket?.name ?? null,
        amountPaid: Number(payment.amount),
      };
    });

    if (!emailData) {
      this.logger.log(`[webhook] Pagamento ${providerPaymentId} já confirmado ou overbooked — sem email`);
      return;
    }

    // Idempotency gate: only send email once even if webhook fires twice
    const marked = await this.prisma.db.registration.updateMany({
      where: { id: emailData.registrationId, confirmationEmailSentAt: null },
      data: { confirmationEmailSentAt: new Date() },
    });
    if (marked.count === 0) {
      this.logger.log(`[webhook] Email já enviado para inscrição ${emailData.registrationId} — ignorado`);
      return;
    }

    this.logger.log(`[webhook] Disparando email de confirmação para ${emailData.participantEmail}`);
    void this.mail.sendRegistrationConfirmation({
      participantName: emailData.participantName,
      participantEmail: emailData.participantEmail,
      eventTitle: emailData.eventTitle,
      eventDate: emailData.eventDate,
      eventLocation: emailData.eventLocation,
      registrationId: emailData.registrationId,
      ticketName: emailData.ticketName,
      amountPaid: emailData.amountPaid,
    });
  }

  /**
   * Consulta o provider diretamente e reconcilia o estado local quando o
   * pagamento ainda está `pending`. Usado como fallback do webhook, para que o
   * polling da tela funcione mesmo se a notificação do provider não chegar.
   * Idempotente e resiliente: erros do provider não propagam.
   */
  async reconcileByProvider(providerPaymentId: string): Promise<void> {
    let status;
    try {
      status = await this.provider.getPaymentStatus(providerPaymentId);
    } catch (err) {
      this.logger.warn(`[reconcile] Falha ao consultar provider ${providerPaymentId}: ${String(err)}`);
      return;
    }

    if (status === 'approved') {
      await this.confirmPayment(providerPaymentId);
    } else if (status === 'rejected' || status === 'expired') {
      await this.prisma.db.payment.updateMany({
        where: { providerPaymentId, status: 'pending' },
        data: { status: 'failed' },
      });
    }
    // 'pending' → nada a fazer
  }

  async getStatus(registrationId: string, userId: string) {
    const registration = await this.prisma.db.registration.findUnique({
      where: { id: registrationId },
      include: { payment: { select: { status: true, amount: true, expiresAt: true, providerPaymentId: true } } },
    });

    if (!registration) throw new NotFoundException('Inscrição não encontrada');
    if (registration.userId !== userId)
      throw new ForbiddenException('Sem permissão');

    // Fallback: reconcilia com o provider se ainda estiver pendente
    if (registration.payment?.status === 'pending' && registration.payment.providerPaymentId) {
      await this.reconcileByProvider(registration.payment.providerPaymentId);
      const refreshed = await this.prisma.db.registration.findUnique({
        where: { id: registrationId },
        include: { payment: { select: { status: true, amount: true, expiresAt: true } } },
      });
      if (refreshed) {
        return {
          registrationStatus: refreshed.status,
          paymentStatus: refreshed.payment?.status ?? null,
          amount: refreshed.payment?.amount ?? null,
          expiresAt: refreshed.payment?.expiresAt ?? null,
        };
      }
    }

    return {
      registrationStatus: registration.status,
      paymentStatus: registration.payment?.status ?? null,
      amount: registration.payment?.amount ?? null,
      expiresAt: registration.payment?.expiresAt ?? null,
    };
  }
}
