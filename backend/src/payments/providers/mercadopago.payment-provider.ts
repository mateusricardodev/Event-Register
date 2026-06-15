import { MercadoPagoConfig, Payment, WebhookSignatureValidator } from 'mercadopago';
import {
  IPaymentProvider,
  PixPaymentInput,
  PixPaymentResult,
  ProviderPaymentStatus,
} from './payment-provider.interface.js';

export class MercadoPagoPaymentProvider implements IPaymentProvider {
  private readonly mp: MercadoPagoConfig;
  private readonly payments: Payment;

  constructor(accessToken: string) {
    this.mp = new MercadoPagoConfig({ accessToken });
    this.payments = new Payment(this.mp);
  }

  async createPixPayment(input: PixPaymentInput): Promise<PixPaymentResult> {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await this.payments.create({
      body: {
        transaction_amount: input.amount,
        payment_method_id: 'pix',
        payer: {
          email: input.payerEmail,
          first_name: input.payerName,
          identification: { type: 'CPF', number: input.payerCpf },
        },
        description: input.description,
        date_of_expiration: expiresAt.toISOString(),
      },
    });

    return {
      providerPaymentId: String(result.id),
      qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64 ?? '',
      qrCodeCopiaECola: result.point_of_interaction?.transaction_data?.qr_code ?? '',
      expiresAt,
    };
  }

  async getPaymentStatus(providerPaymentId: string): Promise<ProviderPaymentStatus> {
    const result = await this.payments.get({ id: Number(providerPaymentId) });
    switch (result.status) {
      case 'approved': return 'approved';
      case 'rejected':
      case 'cancelled': return 'rejected';
      case 'expired': return 'expired';
      default: return 'pending';
    }
  }

  /**
   * Validates the x-signature header sent by Mercado Pago on webhook calls.
   * Format: "ts=<timestamp>,v1=<hmac-sha256>"
   * Call only when MERCADOPAGO_WEBHOOK_SECRET is set.
   */
  validateWebhookSignature(
    secret: string,
    xSignature: string,
    xRequestId: string,
    dataId: string,
  ): boolean {
    try {
      WebhookSignatureValidator.validate({ xSignature, xRequestId, dataId, secret });
      return true;
    } catch {
      return false;
    }
  }
}
