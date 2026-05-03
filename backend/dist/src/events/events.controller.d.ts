import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(): Promise<({
        user: {
            name: string;
            id: string;
        };
        _count: {
            registrations: number;
            tickets: number;
        };
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        bannerUrl: string | null;
        createdBy: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            name: string;
            id: string;
        };
        _count: {
            registrations: number;
        };
        tickets: {
            name: string;
            id: string;
            createdAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
            eventId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        bannerUrl: string | null;
        createdBy: string;
    }>;
    create(user: {
        id: string;
    }, dto: CreateEventDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        bannerUrl: string | null;
        createdBy: string;
    }>;
    update(id: string, user: {
        id: string;
    }, dto: UpdateEventDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        bannerUrl: string | null;
        createdBy: string;
    }>;
    remove(id: string, user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
}
