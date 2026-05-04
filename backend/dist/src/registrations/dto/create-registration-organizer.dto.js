var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateRegistrationOrganizerDto {
    name;
    email;
    cpf;
    ticketId;
    phone;
    birthDate;
    paymentCategory;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateRegistrationOrganizerDto.prototype, "name", void 0);
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], CreateRegistrationOrganizerDto.prototype, "email", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateRegistrationOrganizerDto.prototype, "cpf", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateRegistrationOrganizerDto.prototype, "ticketId", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateRegistrationOrganizerDto.prototype, "phone", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateRegistrationOrganizerDto.prototype, "birthDate", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateRegistrationOrganizerDto.prototype, "paymentCategory", void 0);
//# sourceMappingURL=create-registration-organizer.dto.js.map