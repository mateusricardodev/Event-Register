var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min, } from 'class-validator';
export class CreateEventDto {
    title;
    description;
    location;
    date;
    endDate;
    bannerUrl;
    slug;
    category;
    maxParticipants;
    organizerPhone;
    isPublished;
    about;
    formFields;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "location", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "date", void 0);
__decorate([
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endDate", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "bannerUrl", void 0);
__decorate([
    IsString(),
    IsOptional(),
    Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug deve conter apenas letras minúsculas, números e hífens',
    }),
    __metadata("design:type", String)
], CreateEventDto.prototype, "slug", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "category", void 0);
__decorate([
    IsInt(),
    Min(1),
    IsOptional(),
    __metadata("design:type", Number)
], CreateEventDto.prototype, "maxParticipants", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "organizerPhone", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "isPublished", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "about", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "formFields", void 0);
//# sourceMappingURL=create-event.dto.js.map