var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException, ConflictException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let EventsService = class EventsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        return this.prisma.db.event.findMany({
            where: { createdBy: userId },
            orderBy: { date: 'asc' },
            include: {
                user: { select: { id: true, name: true } },
                _count: { select: { tickets: true, registrations: true } },
            },
        });
    }
    async findOne(id) {
        const event = await this.prisma.db.event.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                tickets: true,
                paymentMethods: { orderBy: { createdAt: 'asc' } },
                _count: { select: { registrations: true } },
            },
        });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        return event;
    }
    async findBySlug(slug) {
        const event = await this.prisma.db.event.findUnique({
            where: { slug },
            include: {
                user: { select: { id: true, name: true } },
                tickets: true,
                paymentMethods: true,
                _count: { select: { registrations: true } },
            },
        });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        return event;
    }
    async create(userId, dto) {
        if (dto.slug) {
            const existing = await this.prisma.db.event.findUnique({ where: { slug: dto.slug } });
            if (existing)
                throw new ConflictException('Esta URL já está em uso');
        }
        return this.prisma.db.event.create({
            data: {
                title: dto.title,
                description: dto.description,
                location: dto.location,
                date: new Date(dto.date),
                endDate: dto.endDate ? new Date(dto.endDate) : null,
                bannerUrl: dto.bannerUrl,
                slug: dto.slug,
                category: dto.category,
                maxParticipants: dto.maxParticipants,
                organizerPhone: dto.organizerPhone,
                about: dto.about,
                formFields: dto.formFields,
                createdBy: userId,
            },
        });
    }
    async update(id, userId, dto) {
        await this.checkOwnership(id, userId);
        if (dto.slug) {
            const existing = await this.prisma.db.event.findFirst({
                where: { slug: dto.slug, NOT: { id } },
            });
            if (existing)
                throw new ConflictException('Esta URL já está em uso');
        }
        return this.prisma.db.event.update({
            where: { id },
            data: {
                ...(dto.title && { title: dto.title }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.location !== undefined && { location: dto.location }),
                ...(dto.date && { date: new Date(dto.date) }),
                ...(dto.endDate !== undefined && { endDate: dto.endDate ? new Date(dto.endDate) : null }),
                ...(dto.bannerUrl !== undefined && { bannerUrl: dto.bannerUrl }),
                ...(dto.slug !== undefined && { slug: dto.slug }),
                ...(dto.category !== undefined && { category: dto.category }),
                ...(dto.maxParticipants !== undefined && { maxParticipants: dto.maxParticipants }),
                ...(dto.organizerPhone !== undefined && { organizerPhone: dto.organizerPhone }),
                ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
                ...(dto.about !== undefined && { about: dto.about }),
                ...(dto.formFields !== undefined && { formFields: dto.formFields }),
            },
        });
    }
    async remove(id, userId) {
        await this.checkOwnership(id, userId);
        await this.prisma.db.$transaction(async (tx) => {
            const registrations = await tx.registration.findMany({
                where: { eventId: id },
                select: { id: true },
            });
            const regIds = registrations.map((r) => r.id);
            await tx.payment.deleteMany({ where: { registrationId: { in: regIds } } });
            await tx.registration.deleteMany({ where: { eventId: id } });
            await tx.eventPaymentMethod.deleteMany({ where: { eventId: id } });
            await tx.ticket.deleteMany({ where: { eventId: id } });
            await tx.event.delete({ where: { id } });
        });
        return { message: 'Evento removido com sucesso' };
    }
    async addPaymentMethod(eventId, userId, dto) {
        await this.checkOwnership(eventId, userId);
        return this.prisma.db.eventPaymentMethod.create({
            data: {
                eventId,
                type: dto.type,
                value: dto.value ?? 0,
                installments: dto.installments ?? 1,
                startDate: dto.startDate ? new Date(dto.startDate) : null,
                endDate: dto.endDate ? new Date(dto.endDate) : null,
            },
        });
    }
    async removePaymentMethod(eventId, methodId, userId) {
        await this.checkOwnership(eventId, userId);
        const method = await this.prisma.db.eventPaymentMethod.findFirst({
            where: { id: methodId, eventId },
        });
        if (!method)
            throw new NotFoundException('Modalidade não encontrada');
        await this.prisma.db.eventPaymentMethod.delete({ where: { id: methodId } });
        return { message: 'Modalidade removida' };
    }
    async uploadBanner(id, userId, filename) {
        await this.checkOwnership(id, userId);
        const bannerUrl = `/uploads/${filename}`;
        await this.prisma.db.event.update({ where: { id }, data: { bannerUrl } });
        return { bannerUrl };
    }
    async getPaymentMethods(eventId, userId) {
        await this.checkOwnership(eventId, userId);
        return this.prisma.db.eventPaymentMethod.findMany({
            where: { eventId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async checkOwnership(id, userId) {
        const event = await this.prisma.db.event.findUnique({ where: { id } });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        if (event.createdBy !== userId)
            throw new ForbiddenException('Apenas o criador pode modificar este evento');
    }
};
EventsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], EventsService);
export { EventsService };
//# sourceMappingURL=events.service.js.map