import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CheckinService } from './checkin.service.js';
import { ListCheckinDto } from './dto/list-checkin.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@UseGuards(JwtGuard)
@Controller('events/:eventId/checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Get('list')
  list(
    @Param('eventId') eventId: string,
    @CurrentUser() user: { id: string },
    @Query() query: ListCheckinDto,
  ) {
    return this.checkinService.list(
      eventId,
      user.id,
      query.filter ?? 'all',
      query.search,
    );
  }

  @Get('stats')
  stats(
    @Param('eventId') eventId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.checkinService.stats(eventId, user.id);
  }

  @Get('by-code/:code')
  byCode(
    @Param('eventId') eventId: string,
    @Param('code') code: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.checkinService.findByCode(eventId, code, user.id);
  }

  @Post(':registrationId')
  checkIn(
    @Param('eventId') eventId: string,
    @Param('registrationId') registrationId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.checkinService.checkIn(eventId, registrationId, user.id);
  }

  @Delete(':registrationId')
  undo(
    @Param('eventId') eventId: string,
    @Param('registrationId') registrationId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.checkinService.undo(eventId, registrationId, user.id);
  }
}
