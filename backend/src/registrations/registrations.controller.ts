import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service.js';
import { CreateRegistrationDto } from './dto/create-registration.dto.js';
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
}
