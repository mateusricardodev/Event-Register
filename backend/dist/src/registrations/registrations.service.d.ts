import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
import { CreateRegistrationOrganizerDto } from './dto/create-registration-organizer.dto.js';
import { UpdateRegistrationDto } from './dto/update-registration.dto.js';
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
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        userId: string;
        ticketId: string | null;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        cpf: string | null;
        phone: string | null;
        birthDate: Date | null;
        extraFields: string | null;
    }>;
    findMyRegistrations(userId: string): Promise<({
        event: {
            id: string;
            title: string;
            location: string | null;
            date: Date;
        };
        ticket: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        payment: {
            id: string;
            status: import("../../generated/prisma/enums.js").PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        userId: string;
        ticketId: string | null;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        cpf: string | null;
        phone: string | null;
        birthDate: Date | null;
        extraFields: string | null;
    })[]>;
    findByEvent(eventId: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
        ticket: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        payment: {
            id: string;
            status: import("../../generated/prisma/enums.js").PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        userId: string;
        ticketId: string | null;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        cpf: string | null;
        phone: string | null;
        birthDate: Date | null;
        extraFields: string | null;
    })[]>;
    createByOrganizer(eventId: string, dto: CreateRegistrationOrganizerDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        userId: string;
        ticketId: string | null;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        cpf: string | null;
        phone: string | null;
        birthDate: Date | null;
        extraFields: string | null;
    }>;
    update(id: string, dto: UpdateRegistrationDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        ticket: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        payment: {
            id: string;
            status: import("../../generated/prisma/enums.js").PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        userId: string;
        ticketId: string | null;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        cpf: string | null;
        phone: string | null;
        birthDate: Date | null;
        extraFields: string | null;
    }>;
    cancel(id: string): Promise<{
        id: string;
        createdAt: Date;
        eventId: string;
        userId: string;
        ticketId: string | null;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        cpf: string | null;
        phone: string | null;
        birthDate: Date | null;
        extraFields: string | null;
    }>;
    createPublic(slug: string, dto: CreateRegistrationOrganizerDto): Promise<{
        event: {
            id: string;
            title: string;
            date: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        userId: string;
        ticketId: string | null;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        cpf: string | null;
        phone: string | null;
        birthDate: Date | null;
        extraFields: string | null;
    }>;
    search(q: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        };
        event: {
            id: string;
            title: string;
        };
        ticket: {
            id: string;
            name: string;
            price: import("@prisma/client-runtime-utils").Decimal;
        } | null;
        payment: {
            id: string;
            status: import("../../generated/prisma/enums.js").PaymentStatus;
            amount: import("@prisma/client-runtime-utils").Decimal;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        userId: string;
        ticketId: string | null;
        status: import("../../generated/prisma/enums.js").RegistrationStatus;
        cpf: string | null;
        phone: string | null;
        birthDate: Date | null;
        extraFields: string | null;
    })[]>;
}
