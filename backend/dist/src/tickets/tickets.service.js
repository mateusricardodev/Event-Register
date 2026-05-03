var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ForbiddenException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
let TicketsService = class TicketsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(eventId) {
        await this.checkEventExists(eventId);
        return this.prisma.db.ticket.findMany({
            where: { eventId },
            orderBy: { createdAt: 'asc' },
            include: {
                _count: { select: { registrations: true } },
            },
        });
    }
    async create(eventId, userId, dto) {
        const event = await this.prisma.db.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        if (event.createdBy !== userId)
            throw new ForbiddenException('Apenas o criador pode adicionar tickets');
        return this.prisma.db.ticket.create({
            data: { ...dto, eventId },
        });
    }
    async checkEventExists(eventId) {
        const event = await this.prisma.db.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
    }
};
TicketsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], TicketsService);
export { TicketsService };
//# sourceMappingURL=tickets.service.js.map