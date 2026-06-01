import { Body, Controller, Get, Param, Patch, ParseIntPipe, Post, Put, Query, UseGuards, DefaultValuePipe } from '@nestjs/common';
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
  myRegistrations(
    @CurrentUser() user: { id: string },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.registrationsService.findMyRegistrations(user.id, page, limit);
  }

  @UseGuards(JwtGuard)
  @Get('events/:eventId/registrations')
  findByEvent(
    @Param('eventId') eventId: string,
    @CurrentUser() user: { id: string },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.registrationsService.findByEvent(eventId, user.id, page, limit);
  }

  @UseGuards(JwtGuard)
  @Post('events/:eventId/registrations')
  createByOrganizer(
    @Param('eventId') eventId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateRegistrationOrganizerDto,
  ) {
    return this.registrationsService.createByOrganizer(eventId, user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Get('registrations/search')
  search(@Query('q') q: string, @CurrentUser() user: { id: string }) {
    return this.registrationsService.search(q ?? '', user.id);
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
