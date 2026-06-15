export interface PixPaymentInput {
  registrationId: string;
  amount: number;
  payerName: string;
  payerEmail: string;
  payerCpf: string;
  description: string;
}

export interface PixPaymentResult {
  providerPaymentId: string;
  qrCodeBase64: string;
  qrCodeCopiaECola: string;
  expiresAt: Date;
}

export type ProviderPaymentStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface IPaymentProvider {
  createPixPayment(input: PixPaymentInput): Promise<PixPaymentResult>;
  getPaymentStatus(providerPaymentId: string): Promise<ProviderPaymentStatus>;
}
