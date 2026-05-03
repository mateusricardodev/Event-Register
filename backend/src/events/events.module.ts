import { Module } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventsController } from './events.controller.js';

@Module({
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
