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
import * as bcrypt from 'bcrypt';
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
    async findByEvent(eventId) {
        return this.prisma.db.registration.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
                ticket: { select: { id: true, name: true, price: true } },
                payment: { select: { id: true, status: true, amount: true } },
            },
        });
    }
    async createByOrganizer(eventId, dto) {
        const event = await this.prisma.db.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        const ticket = await this.prisma.db.ticket.findUnique({ where: { id: dto.ticketId } });
        if (!ticket)
            throw new NotFoundException('Ticket não encontrado');
        if (ticket.eventId !== eventId)
            throw new BadRequestException('Ticket não pertence a este evento');
        const used = await this.prisma.db.registration.count({
            where: { ticketId: dto.ticketId, status: { not: 'canceled' } },
        });
        if (used >= ticket.quantity)
            throw new BadRequestException('Ingressos esgotados para este ticket');
        let user = await this.prisma.db.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
            user = await this.prisma.db.user.create({
                data: { name: dto.name, email: dto.email, password: randomPassword },
            });
        }
        const registration = await this.prisma.db.registration.create({
            data: {
                userId: user.id,
                eventId,
                ticketId: dto.ticketId,
                status: 'confirmed',
                cpf: dto.cpf,
                phone: dto.phone,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                ticket: { select: { id: true, name: true, price: true } },
            },
        });
        if (Number(ticket.price) > 0) {
            await this.prisma.db.payment.create({
                data: {
                    registrationId: registration.id,
                    amount: ticket.price,
                    status: 'paid',
                    provider: dto.paymentCategory ?? 'mock',
                },
            });
        }
        return registration;
    }
    async update(id, dto) {
        const registration = await this.prisma.db.registration.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!registration)
            throw new NotFoundException('Inscrição não encontrada');
        if (dto.name) {
            await this.prisma.db.user.update({
                where: { id: registration.userId },
                data: { name: dto.name },
            });
        }
        return this.prisma.db.registration.update({
            where: { id },
            data: {
                ...(dto.cpf && { cpf: dto.cpf }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.birthDate !== undefined && {
                    birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
                }),
                ...(dto.ticketId && { ticketId: dto.ticketId }),
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                ticket: { select: { id: true, name: true, price: true } },
                payment: { select: { id: true, status: true, amount: true } },
            },
        });
    }
    async cancel(id) {
        const registration = await this.prisma.db.registration.findUnique({ where: { id } });
        if (!registration)
            throw new NotFoundException('Inscrição não encontrada');
        return this.prisma.db.registration.update({
            where: { id },
            data: { status: 'canceled' },
        });
    }
    async search(q) {
        if (!q || q.trim().length < 2)
            return [];
        return this.prisma.db.registration.findMany({
            where: {
                OR: [
                    { user: { name: { contains: q, mode: 'insensitive' } } },
                    { user: { email: { contains: q, mode: 'insensitive' } } },
                    { cpf: { contains: q } },
                    { id: { contains: q, mode: 'insensitive' } },
                ],
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                user: { select: { id: true, name: true, email: true } },
                ticket: { select: { id: true, name: true, price: true } },
                event: { select: { id: true, title: true } },
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