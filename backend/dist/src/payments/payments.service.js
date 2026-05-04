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
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const registration = await this.prisma.db.registration.findUnique({
            where: { id: dto.registrationId },
            include: { ticket: true, payment: true },
        });
        if (!registration) {
            throw new NotFoundException('Inscrição não encontrada');
        }
        if (registration.userId !== userId) {
            throw new ForbiddenException('Esta inscrição não pertence a você');
        }
        if (registration.payment) {
            throw new ConflictException('Esta inscrição já possui um pagamento');
        }
        const [payment] = await this.prisma.db.$transaction([
            this.prisma.db.payment.create({
                data: {
                    registrationId: registration.id,
                    amount: registration.ticket?.price ?? 0,
                    status: 'paid',
                    provider: 'mock',
                },
            }),
            this.prisma.db.registration.update({
                where: { id: registration.id },
                data: { status: 'confirmed' },
            }),
        ]);
        return {
            ...payment,
            registration: {
                id: registration.id,
                status: 'confirmed',
                eventId: registration.eventId,
                ticketId: registration.ticketId,
            },
        };
    }
};
PaymentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PaymentsService);
export { PaymentsService };
//# sourceMappingURL=payments.service.js.map