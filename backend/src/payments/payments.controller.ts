import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@UseGuards(JwtGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(user.id, dto);
  }
}
