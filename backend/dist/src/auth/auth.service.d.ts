import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        name: string;
        email: string;
        id: string;
        role: import("../../generated/prisma/enums.js").Role;
        createdAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    me(userId: string): Promise<{
        name: string;
        email: string;
        id: string;
        role: import("../../generated/prisma/enums.js").Role;
        createdAt: Date;
    } | null>;
}
