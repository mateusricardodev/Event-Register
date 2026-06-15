import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { IPaymentProvider } from './providers/payment-provider.interface.js';
import { PAYMENT_PROVIDER_TOKEN } from './providers/payment-provider.factory.js';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_PROVIDER_TOKEN) private readonly provider: IPaymentProvider,
  ) {}

  async createPixForRegistration(registrationId: string, userId: string) {
    const registration = await this.prisma.db.registration.findUnique({
      where: { id: registrationId },
      include: { ticket: true, event: true, user: true, payment: true },
    });

    if (!registration) throw new NotFoundException('Inscrição não encontrada');
    if (registration.userId !== userId)
      throw new ForbiddenException('Esta inscrição não pertence a você');
    if (registration.payment?.status === 'paid')
      throw new ConflictException('Pagamento já confirmado');

    // Amount is always sourced from the ticket in the DB — never from the client
    const amount = Number(registration.ticket?.price ?? 0);
    if (amount === 0)
      throw new BadRequestException('Este ingresso é gratuito — nenhum pagamento necessário');

    // Discard any previous pending attempt so the user can retry
    if (registration.payment) {
      await this.prisma.db.payment.delete({ where: { id: registration.payment.id } });
    }

    const result = await this.provider.createPixPayment({
      registrationId,
      amount,
      payerName: registration.user.name,
      payerEmail: registration.user.email,
      payerCpf: registration.cpf ?? '',
      description: `${registration.event.title} — ${registration.ticket?.name ?? 'Inscrição'}`,
    });

    const payment = await this.prisma.db.payment.create({
      data: {
        registrationId,
        amount,
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
      amount,
    };
  }

  /**
   * Marks payment as paid and registration as confirmed.
   * Idempotent: a second call for an already-paid payment is a no-op.
   * TODO (Etapa 3): add ticket stock decrement inside this transaction.
   */
  async confirmPayment(providerPaymentId: string): Promise<void> {
    await this.prisma.db.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { providerPaymentId, status: { not: 'paid' } },
      });
      if (!payment) return; // already confirmed — idempotent no-op

      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'paid' },
      });

      await tx.registration.update({
        where: { id: payment.registrationId },
        data: { status: 'confirmed' },
      });
    });
  }

  async getStatus(registrationId: string, userId: string) {
    const registration = await this.prisma.db.registration.findUnique({
      where: { id: registrationId },
      include: { payment: { select: { status: true, amount: true, expiresAt: true } } },
    });

    if (!registration) throw new NotFoundException('Inscrição não encontrada');
    if (registration.userId !== userId)
      throw new ForbiddenException('Sem permissão');

    return {
      registrationStatus: registration.status,
      paymentStatus: registration.payment?.status ?? null,
      amount: registration.payment?.amount ?? null,
      expiresAt: registration.payment?.expiresAt ?? null,
    };
  }
}
