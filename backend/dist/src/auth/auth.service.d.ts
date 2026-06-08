import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../generated/prisma/enums.js").Role;
        createdAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    me(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../generated/prisma/enums.js").Role;
        createdAt: Date;
    }>;
}
