import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto.js';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(user: {
        id: string;
    }): Promise<({
        user: {
            id: string;
            name: string;
        };
        _count: {
            registrations: number;
            tickets: number;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string | null;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        endDate: Date | null;
        bannerUrl: string | null;
        category: string | null;
        maxParticipants: number | null;
        organizerPhone: string | null;
        isPublished: boolean;
        about: string | null;
        formFields: string | null;
        createdBy: string;
    })[]>;
    findBySlug(slug: string): Promise<{
        user: {
            id: string;
            name: string;
        };
        tickets: {
            id: string;
            name: string;
            createdAt: Date;
            eventId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
        }[];
        paymentMethods: {
            id: string;
            createdAt: Date;
            endDate: Date | null;
            eventId: string;
            type: string;
            value: import("@prisma/client-runtime-utils").Decimal;
            installments: number;
            startDate: Date | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string | null;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        endDate: Date | null;
        bannerUrl: string | null;
        category: string | null;
        maxParticipants: number | null;
        organizerPhone: string | null;
        isPublished: boolean;
        about: string | null;
        formFields: string | null;
        createdBy: string;
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        tickets: {
            id: string;
            name: string;
            createdAt: Date;
            eventId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            quantity: number;
        }[];
        paymentMethods: {
            id: string;
            createdAt: Date;
            endDate: Date | null;
            eventId: string;
            type: string;
            value: import("@prisma/client-runtime-utils").Decimal;
            installments: number;
            startDate: Date | null;
        }[];
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string | null;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        endDate: Date | null;
        bannerUrl: string | null;
        category: string | null;
        maxParticipants: number | null;
        organizerPhone: string | null;
        isPublished: boolean;
        about: string | null;
        formFields: string | null;
        createdBy: string;
    }>;
    create(user: {
        id: string;
    }, dto: CreateEventDto): Promise<{
        id: string;
        createdAt: Date;
        slug: string | null;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        endDate: Date | null;
        bannerUrl: string | null;
        category: string | null;
        maxParticipants: number | null;
        organizerPhone: string | null;
        isPublished: boolean;
        about: string | null;
        formFields: string | null;
        createdBy: string;
    }>;
    update(id: string, user: {
        id: string;
    }, dto: UpdateEventDto): Promise<{
        id: string;
        createdAt: Date;
        slug: string | null;
        title: string;
        description: string | null;
        location: string | null;
        date: Date;
        endDate: Date | null;
        bannerUrl: string | null;
        category: string | null;
        maxParticipants: number | null;
        organizerPhone: string | null;
        isPublished: boolean;
        about: string | null;
        formFields: string | null;
        createdBy: string;
    }>;
    remove(id: string, user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
    getPaymentMethods(id: string, user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        endDate: Date | null;
        eventId: string;
        type: string;
        value: import("@prisma/client-runtime-utils").Decimal;
        installments: number;
        startDate: Date | null;
    }[]>;
    addPaymentMethod(id: string, user: {
        id: string;
    }, dto: CreatePaymentMethodDto): Promise<{
        id: string;
        createdAt: Date;
        endDate: Date | null;
        eventId: string;
        type: string;
        value: import("@prisma/client-runtime-utils").Decimal;
        installments: number;
        startDate: Date | null;
    }>;
    uploadBanner(id: string, user: {
        id: string;
    }, file: Express.Multer.File): Promise<{
        bannerUrl: string;
    }>;
    removePaymentMethod(id: string, methodId: string, user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
}
