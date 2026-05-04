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
import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
import { CreateRegistrationOrganizerDto } from './dto/create-registration-organizer.dto.js';
import { UpdateRegistrationDto } from './dto/update-registration.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let RegistrationsController = class RegistrationsController {
    registrationsService;
    constructor(registrationsService) {
        this.registrationsService = registrationsService;
    }
    create(user, dto) {
        return this.registrationsService.create(user.id, dto);
    }
    myRegistrations(user) {
        return this.registrationsService.findMyRegistrations(user.id);
    }
    findByEvent(eventId) {
        return this.registrationsService.findByEvent(eventId);
    }
    createByOrganizer(eventId, dto) {
        return this.registrationsService.createByOrganizer(eventId, dto);
    }
    search(q) {
        return this.registrationsService.search(q ?? '');
    }
    update(id, dto) {
        return this.registrationsService.update(id, dto);
    }
    cancel(id) {
        return this.registrationsService.cancel(id);
    }
    createPublic(slug, dto) {
        return this.registrationsService.createPublic(slug, dto);
    }
};
__decorate([
    UseGuards(JwtGuard),
    Post('registrations'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateRegistrationDto]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "create", null);
__decorate([
    UseGuards(JwtGuard),
    Get('my-registrations'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "myRegistrations", null);
__decorate([
    UseGuards(JwtGuard),
    Get('events/:eventId/registrations'),
    __param(0, Param('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "findByEvent", null);
__decorate([
    UseGuards(JwtGuard),
    Post('events/:eventId/registrations'),
    __param(0, Param('eventId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateRegistrationOrganizerDto]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "createByOrganizer", null);
__decorate([
    UseGuards(JwtGuard),
    Get('registrations/search'),
    __param(0, Query('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "search", null);
__decorate([
    UseGuards(JwtGuard),
    Put('registrations/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateRegistrationDto]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "update", null);
__decorate([
    UseGuards(JwtGuard),
    Patch('registrations/:id/cancel'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "cancel", null);
__decorate([
    Post('events/public/:slug/register'),
    __param(0, Param('slug')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateRegistrationOrganizerDto]),
    __metadata("design:returntype", void 0)
], RegistrationsController.prototype, "createPublic", null);
RegistrationsController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [RegistrationsService])
], RegistrationsController);
export { RegistrationsController };
//# sourceMappingURL=registrations.controller.js.map