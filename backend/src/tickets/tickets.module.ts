import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { TicketsController } from './tickets.controller.js';

@Module({
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
