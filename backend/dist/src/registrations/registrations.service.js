var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let RegistrationsService = class RegistrationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const event = await this.prisma.db.event.findUnique({
            where: { id: dto.eventId },
        });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        const ticket = await this.prisma.db.ticket.findUnique({
            where: { id: dto.ticketId },
        });
        if (!ticket)
            throw new NotFoundException('Ticket não encontrado');
        if (ticket.eventId !== dto.eventId)
            throw new BadRequestException('Ticket não pertence a este evento');
        const used = await this.prisma.db.registration.count({
            where: {
                ticketId: dto.ticketId,
                status: { not: 'canceled' },
            },
        });
        if (used >= ticket.quantity)
            throw new BadRequestException('Ingressos esgotados para este ticket');
        return this.prisma.db.registration.create({
            data: {
                userId,
                eventId: dto.eventId,
                ticketId: dto.ticketId,
            },
            include: {
                event: { select: { id: true, title: true, date: true } },
                ticket: { select: { id: true, name: true, price: true } },
            },
        });
    }
    async findMyRegistrations(userId) {
        return this.prisma.db.registration.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                event: { select: { id: true, title: true, date: true, location: true } },
                ticket: { select: { id: true, name: true, price: true } },
                payment: { select: { id: true, status: true, amount: true } },
            },
        });
    }
};
RegistrationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], RegistrationsService);
export { RegistrationsService };
//# sourceMappingURL=registrations.service.js.map