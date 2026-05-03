import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  registrationId: string;
}
