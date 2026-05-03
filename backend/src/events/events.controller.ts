import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.eventsService.remove(id, user.id);
  }
}
