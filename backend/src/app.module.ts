import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { EventsModule } from './events/events.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { RegistrationsModule } from './registrations/registrations.module.js';
import { PaymentsModule } from './payments/payments.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    EventsModule,
    TicketsModule,
    RegistrationsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
