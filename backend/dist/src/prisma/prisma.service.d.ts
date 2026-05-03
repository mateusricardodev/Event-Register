import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
export declare class PrismaService implements OnModuleInit {
    readonly db: PrismaClient;
    constructor();
    onModuleInit(): Promise<void>;
}
