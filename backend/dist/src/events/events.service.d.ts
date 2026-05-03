import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    create(userId: string, dto: CreateEventDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        bannerUrl: string | null;
        createdBy: string;
    }>;
    update(id: string, userId: string, dto: UpdateEventDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        bannerUrl: string | null;
        createdBy: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    private checkOwnership;
}
