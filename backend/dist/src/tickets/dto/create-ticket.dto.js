var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export class CreateTicketDto {
    name;
    price;
    quantity;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "name", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "price", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "quantity", void 0);
//# sourceMappingURL=create-ticket.dto.js.map