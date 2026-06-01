import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
import { CreateRegistrationOrganizerDto } from './dto/create-registration-organizer.dto.js';
import { UpdateRegistrationDto } from './dto/update-registration.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller()
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @UseGuards(JwtGuard)
  @Post('registrations')
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateRegistrationDto,
  ) {
    return this.registrationsService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get('my-registrations')
  myRegistrations(@CurrentUser() user: { id: string }) {
    return this.registrationsService.findMyRegistrations(user.id);
  }

  @UseGuards(JwtGuard)
  @Get('events/:eventId/registrations')
  findByEvent(@Param('eventId') eventId: string) {
    return this.registrationsService.findByEvent(eventId);
  }

  @UseGuards(JwtGuard)
  @Post('events/:eventId/registrations')
  createByOrganizer(
    @Param('eventId') eventId: string,
    @Body() dto: CreateRegistrationOrganizerDto,
  ) {
    return this.registrationsService.createByOrganizer(eventId, dto);
  }

  @UseGuards(JwtGuard)
  @Get('registrations/search')
  search(@Query('q') q: string) {
    return this.registrationsService.search(q ?? '');
  }

  @UseGuards(JwtGuard)
  @Put('registrations/:id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateRegistrationDto,
  ) {
    return this.registrationsService.update(id, user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch('registrations/:id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.registrationsService.cancel(id, user.id);
  }

  @Post('events/public/:slug/register')
  createPublic(
    @Param('slug') slug: string,
    @Body() dto: CreateRegistrationOrganizerDto,
  ) {
    return this.registrationsService.createPublic(slug, dto);
  }
}
