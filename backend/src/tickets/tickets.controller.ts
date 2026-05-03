import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('events/:eventId/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.ticketsService.findAll(eventId);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Param('eventId') eventId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateTicketDto,
  ) {
    return this.ticketsService.create(eventId, user.id, dto);
  }
}
