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
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
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
RegistrationsController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [RegistrationsService])
], RegistrationsController);
export { RegistrationsController };
//# sourceMappingURL=registrations.controller.js.map