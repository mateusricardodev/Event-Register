import { Controller, Get, UseGuards } from '@nestjs/common';
import { CheckinService } from './checkin.service.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@UseGuards(JwtGuard)
@Controller('me/checkin')
export class MeCheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Get('events')
  myEvents(@CurrentUser() user: { id: string }) {
    return this.checkinService.myEvents(user.id);
  }
}
