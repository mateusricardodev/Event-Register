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
let EventsService = class EventsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.db.event.findMany({
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
                user: { select: { id: true, name: true } },
                tickets: true,
                _count: { select: { registrations: true } },
            },
        });
        if (!event)
            throw new NotFoundException('Evento não encontrado');
        return event;
    }
    async create(userId, dto) {
        return this.prisma.db.event.create({
            data: {
                ...dto,
                date: new Date(dto.date),
                createdBy: userId,
            },
        });
    }
    async update(id, userId, dto) {
        await this.checkOwnership(id, userId);
        return this.prisma.db.event.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.date && { date: new Date(dto.date) }),
            },
        });
    }
    async remove(id, userId) {
        await this.checkOwnership(id, userId);
        await this.prisma.db.event.delete({ where: { id } });
        return { message: 'Evento removido com sucesso' };
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