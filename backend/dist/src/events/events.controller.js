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
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let EventsController = class EventsController {
    eventsService;
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    findAll(user) {
        return this.eventsService.findAll(user.id);
    }
    findBySlug(slug) {
        return this.eventsService.findBySlug(slug);
    }
    findOne(id) {
        return this.eventsService.findOne(id);
    }
    create(user, dto) {
        return this.eventsService.create(user.id, dto);
    }
    update(id, user, dto) {
        return this.eventsService.update(id, user.id, dto);
    }
    remove(id, user) {
        return this.eventsService.remove(id, user.id);
    }
    getPaymentMethods(id) {
        return this.eventsService.getPaymentMethods(id);
    }
    addPaymentMethod(id, user, dto) {
        return this.eventsService.addPaymentMethod(id, user.id, dto);
    }
    removePaymentMethod(id, methodId, user) {
        return this.eventsService.removePaymentMethod(id, methodId, user.id);
    }
};
__decorate([
    UseGuards(JwtGuard),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findAll", null);
__decorate([
    Get('public/:slug'),
    __param(0, Param('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findBySlug", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findOne", null);
__decorate([
    UseGuards(JwtGuard),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "create", null);
__decorate([
    UseGuards(JwtGuard),
    Put(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, UpdateEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "update", null);
__decorate([
    UseGuards(JwtGuard),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "remove", null);
__decorate([
    UseGuards(JwtGuard),
    Get(':id/payment-methods'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "getPaymentMethods", null);
__decorate([
    UseGuards(JwtGuard),
    Post(':id/payment-methods'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, CreatePaymentMethodDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "addPaymentMethod", null);
__decorate([
    UseGuards(JwtGuard),
    Delete(':id/payment-methods/:methodId'),
    __param(0, Param('id')),
    __param(1, Param('methodId')),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "removePaymentMethod", null);
EventsController = __decorate([
    Controller('events'),
    __metadata("design:paramtypes", [EventsService])
], EventsController);
export { EventsController };
//# sourceMappingURL=events.controller.js.map