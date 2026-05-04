import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
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
    create(eventId: string, user: {
        id: string;
    }, dto: CreateTicketDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        eventId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
    }>;
}
