import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly db: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.db.$connect();
  }
}
