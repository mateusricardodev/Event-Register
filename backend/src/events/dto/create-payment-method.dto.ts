import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export const PAYMENT_METHOD_TYPES = ['pix', 'credit_card', 'debit_card', 'cash'] as const;

export class CreatePaymentMethodDto {
  @IsIn(PAYMENT_METHOD_TYPES, { message: 'Forma de pagamento inválida' })
  type: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ser numérico' })
  @Min(0)
  @Max(1_000_000)
  @IsOptional()
  value?: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  installments?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
