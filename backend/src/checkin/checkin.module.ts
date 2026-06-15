import { Module } from '@nestjs/common';
import { CheckinService } from './checkin.service.js';
import { CheckinController } from './checkin.controller.js';
import { MeCheckinController } from './me-checkin.controller.js';

@Module({
  providers: [CheckinService],
  controllers: [CheckinController, MeCheckinController],
})
export class CheckinModule {}
