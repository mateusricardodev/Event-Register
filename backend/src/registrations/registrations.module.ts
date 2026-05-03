import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service.js';
import { RegistrationsController } from './registrations.controller.js';

@Module({
  providers: [RegistrationsService],
  controllers: [RegistrationsController],
})
export class RegistrationsModule {}
