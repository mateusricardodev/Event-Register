var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let TicketsController = class TicketsController {
    ticketsService;
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    findAll(eventId) {
        return this.ticketsService.findAll(eventId);
    }
    create(eventId, user, dto) {
        return this.ticketsService.create(eventId, user.id, dto);
    }
};
__decorate([
    Get(),
    __param(0, Param('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findAll", null);
__decorate([
    UseGuards(JwtGuard),
    Post(),
    __param(0, Param('eventId')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, CreateTicketDto]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "create", null);
TicketsController = __decorate([
    Controller('events/:eventId/tickets'),
    __metadata("design:paramtypes", [TicketsService])
], TicketsController);
export { TicketsController };
//# sourceMappingURL=tickets.controller.js.map