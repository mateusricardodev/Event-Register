var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
export class CreatePaymentMethodDto {
    type;
    value;
    installments;
    startDate;
    endDate;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "type", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Number)
], CreatePaymentMethodDto.prototype, "value", void 0);
__decorate([
    IsInt(),
    Min(1),
    IsOptional(),
    __metadata("design:type", Number)
], CreatePaymentMethodDto.prototype, "installments", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "startDate", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePaymentMethodDto.prototype, "endDate", void 0);
//# sourceMappingURL=create-payment-method.dto.js.map