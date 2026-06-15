import { ConfigService } from '@nestjs/config';
import { IPaymentProvider } from './payment-provider.interface.js';
import { MockPaymentProvider } from './mock.payment-provider.js';
import { MercadoPagoPaymentProvider } from './mercadopago.payment-provider.js';

export const PAYMENT_PROVIDER_TOKEN = 'PAYMENT_PROVIDER';

export function paymentProviderFactory(config: ConfigService): IPaymentProvider {
  if (config.get('PAYMENT_PROVIDER') === 'mercadopago') {
    const token = config.get<string>('MERCADOPAGO_ACCESS_TOKEN', '');
    return new MercadoPagoPaymentProvider(token);
  }
  return new MockPaymentProvider();
}
