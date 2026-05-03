import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
export declare class PaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreatePaymentDto): Promise<{
        registration: {
            id: string;
            status: string;
            eventId: string;
            ticketId: string;
        };
        id: string;
        createdAt: Date;
        status: import("../../generated/prisma/enums.js").PaymentStatus;
        registrationId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        provider: string;
    }>;
}
