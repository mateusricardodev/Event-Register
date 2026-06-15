import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MailModule } from '../mail/mail.module.js';
import {
  PAYMENT_PROVIDER_TOKEN,
  paymentProviderFactory,
} from './providers/payment-provider.factory.js';

@Module({
  imports: [PrismaModule, ConfigModule, MailModule],
  providers: [
    {
      provide: PAYMENT_PROVIDER_TOKEN,
      useFactory: paymentProviderFactory,
      inject: [ConfigService],
    },
    PaymentsService,
  ],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
