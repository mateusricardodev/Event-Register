var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
let RegistrationsService = class RegistrationsService {
    prisma;
    mail;
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async create(userId, dto) {
        const event = await this.prisma.db.event.findUnique({ where: { id: dto.eventId } });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        const ticket = await this.prisma.db.ticket.findUnique({ where: { id: dto.ticketId } });
        if (!ticket)
            throw new NotFoundException('Ticket não encontrado');
        if (ticket.eventId !== dto.eventId)
            throw new BadRequestException('Ticket não pertence a este evento');
        return this.prisma.db.$transaction(async (tx) => {
            const used = await tx.registration.count({
                where: { ticketId: dto.ticketId, status: { not: 'canceled' } },
            });
            if (used >= ticket.quantity)
                throw new BadRequestException('Ingressos esgotados para este ticket');
            return tx.registration.create({
                data: { userId, eventId: dto.eventId, ticketId: dto.ticketId },
                include: {
                    event: { select: { id: true, title: true, date: true } },
                    ticket: { select: { id: true, name: true, price: true } },
                },
            });
        }, { isolationLevel: 'Serializable' });
    }
    async findMyRegistrations(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.db.registration.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    event: { select: { id: true, title: true, date: true, location: true } },
                    ticket: { select: { id: true, name: true, price: true } },
                    payment: { select: { id: true, status: true, amount: true } },
                },
            }),
            this.prisma.db.registration.count({ where: { userId } }),
        ]);
        return { data, total, page, limit };
    }
    async findByEvent(eventId, userId, page = 1, limit = 50) {
        const event = await this.prisma.db.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        if (event.createdBy !== userId)
            throw new ForbiddenException('Sem permissão para acessar estas inscrições');
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.db.registration.findMany({
                where: { eventId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    ticket: { select: { id: true, name: true, price: true } },
                    payment: { select: { id: true, status: true, amount: true } },
                },
            }),
            this.prisma.db.registration.count({ where: { eventId } }),
        ]);
        return { data, total, page, limit };
    }
    async createByOrganizer(eventId, userId, dto) {
        const event = await this.prisma.db.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        if (event.createdBy !== userId)
            throw new ForbiddenException('Sem permissão para adicionar inscrições a este evento');
        const registration = await this.prisma.db.$transaction(async (tx) => {
            if (event.maxParticipants) {
                const count = await tx.registration.count({
                    where: { eventId, status: { not: 'canceled' } },
                });
                if (count >= event.maxParticipants)
                    throw new BadRequestException('Evento lotado');
            }
            const duplicate = await tx.registration.findFirst({
                where: { eventId, cpf: dto.cpf, status: { not: 'canceled' } },
            });
            if (duplicate)
                throw new BadRequestException('CPF já inscrito neste evento');
            let user = await tx.user.findUnique({ where: { email: dto.email } });
            if (!user) {
                const randomPassword = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
                user = await tx.user.create({
                    data: { name: dto.name, email: dto.email, password: randomPassword },
                });
            }
            return tx.registration.create({
                data: {
                    userId: user.id,
                    eventId,
                    status: 'confirmed',
                    cpf: dto.cpf,
                    phone: dto.phone,
                    birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
                },
                include: { user: { select: { id: true, name: true, email: true } } },
            });
        }, { isolationLevel: 'Serializable' });
        void this.mail.sendRegistrationConfirmation({
            participantName: dto.name,
            participantEmail: dto.email,
            eventTitle: event.title,
            eventDate: event.date,
            eventLocation: event.location,
            registrationId: registration.id,
        });
        return registration;
    }
    async update(id, userId, dto) {
        const registration = await this.prisma.db.registration.findUnique({
            where: { id },
            include: { user: true, event: true },
        });
        if (!registration)
            throw new NotFoundException('Inscrição não encontrada');
        if (registration.event.createdBy !== userId)
            throw new ForbiddenException('Sem permissão para editar esta inscrição');
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
    async cancel(id, userId) {
        const registration = await this.prisma.db.registration.findUnique({
            where: { id },
            include: { event: true },
        });
        if (!registration)
            throw new NotFoundException('Inscrição não encontrada');
        if (registration.event.createdBy !== userId)
            throw new ForbiddenException('Sem permissão para cancelar esta inscrição');
        return this.prisma.db.registration.update({
            where: { id },
            data: { status: 'canceled' },
        });
    }
    async createPublic(slug, dto) {
        const event = await this.prisma.db.event.findUnique({ where: { slug } });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        if (!event.isPublished)
            throw new BadRequestException('Este evento não está disponível para inscrições');
        const registration = await this.prisma.db.$transaction(async (tx) => {
            if (event.maxParticipants) {
                const count = await tx.registration.count({
                    where: { eventId: event.id, status: { not: 'canceled' } },
                });
                if (count >= event.maxParticipants)
                    throw new BadRequestException('Evento lotado');
            }
            const duplicate = await tx.registration.findFirst({
                where: { eventId: event.id, cpf: dto.cpf, status: { not: 'canceled' } },
            });
            if (duplicate)
                throw new BadRequestException('CPF já inscrito neste evento');
            let user = await tx.user.findUnique({ where: { email: dto.email } });
            if (!user) {
                const randomPassword = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
                user = await tx.user.create({
                    data: { name: dto.name, email: dto.email, password: randomPassword },
                });
            }
            return tx.registration.create({
                data: {
                    userId: user.id,
                    eventId: event.id,
                    status: 'confirmed',
                    cpf: dto.cpf,
                    phone: dto.phone,
                    birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
                    extraFields: dto.extraFields ? JSON.stringify(dto.extraFields) : null,
                },
                include: { event: { select: { id: true, title: true, date: true } } },
            });
        }, { isolationLevel: 'Serializable' });
        void this.mail.sendRegistrationConfirmation({
            participantName: dto.name,
            participantEmail: dto.email,
            eventTitle: event.title,
            eventDate: event.date,
            eventLocation: event.location,
            registrationId: registration.id,
        });
        return registration;
    }
    async search(q, userId) {
        if (!q || q.trim().length < 2)
            return [];
        return this.prisma.db.registration.findMany({
            where: {
                event: { createdBy: userId },
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
    __metadata("design:paramtypes", [PrismaService,
        MailService])
], RegistrationsService);
export { RegistrationsService };
//# sourceMappingURL=registrations.service.js.map