import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateRegistrationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  ticketId?: string;

  @IsString()
  @IsOptional()
  paymentCategory?: string;

  @IsObject()
  @IsOptional()
  extraFields?: Record<string, string>;
}
