import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
export declare class TicketsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(eventId: string): Promise<({
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        eventId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
    })[]>;
    create(eventId: string, userId: string, dto: CreateTicketDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        eventId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
    }>;
    private checkEventExists;
}
