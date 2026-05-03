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
        name: string;
        id: string;
        createdAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        eventId: string;
    })[]>;
    create(eventId: string, userId: string, dto: CreateTicketDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        eventId: string;
    }>;
    private checkEventExists;
}
