import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
export declare class RegistrationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateRegistrationDto): Promise<{
        event: {
            id: string;
            title: string;
            date: Date;
        };
        ticket: {
            name: string;
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        ticketId: string;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        userId: string;
    }>;
    findMyRegistrations(userId: string): Promise<({
        event: {
            id: string;
            title: string;
            location: string | null;
            date: Date;
        };
        ticket: {
            name: string;
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
        };
        payment: {
            id: string;
            status: import("../../generated/prisma/enums.js").PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        ticketId: string;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        userId: string;
    })[]>;
}
