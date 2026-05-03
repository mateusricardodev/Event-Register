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
        name: string;
        id: string;
        createdAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        eventId: string;
    })[]>;
    create(eventId: string, user: {
        id: string;
    }, dto: CreateTicketDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        quantity: number;
        eventId: string;
    }>;
}
