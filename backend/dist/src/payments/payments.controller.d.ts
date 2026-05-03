import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(user: {
        id: string;
    }, dto: CreatePaymentDto): Promise<{
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
