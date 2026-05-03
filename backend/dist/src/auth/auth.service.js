var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ConflictException, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        const exists = await this.prisma.db.user.findUnique({
            where: { email: dto.email },
        });
        if (exists) {
            throw new ConflictException('E-mail já cadastrado');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.db.user.create({
            data: { name: dto.name, email: dto.email, password: hashed },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        return user;
    }
    async login(dto) {
        const user = await this.prisma.db.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
        const token = this.jwt.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return { access_token: token };
    }
    async me(userId) {
        return this.prisma.db.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map