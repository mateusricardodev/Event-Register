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
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtGuard)
  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.eventsService.findAll(user.id);
  }

  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
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

  @UseGuards(JwtGuard)
  @Get(':id/payment-methods')
  getPaymentMethods(@Param('id') id: string) {
    return this.eventsService.getPaymentMethods(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/payment-methods')
  addPaymentMethod(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.eventsService.addPaymentMethod(id, user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/payment-methods/:methodId')
  removePaymentMethod(
    @Param('id') id: string,
    @Param('methodId') methodId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.eventsService.removePaymentMethod(id, methodId, user.id);
  }
}
