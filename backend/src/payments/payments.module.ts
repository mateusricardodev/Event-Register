import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
