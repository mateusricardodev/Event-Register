import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    me(user: {
        id: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("../../generated/prisma/enums.js").Role;
        createdAt: Date;
    } | null>;
}
