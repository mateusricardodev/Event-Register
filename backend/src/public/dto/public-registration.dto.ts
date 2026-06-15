import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsCpf } from '../../common/validators/is-cpf.validator.js';

export class PublicRegistrationDto {
  @IsUUID()
  @IsNotEmpty()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsCpf()
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @IsOptional()
  extraFields?: Record<string, string>;

  @IsBoolean()
  @Equals(true, { message: 'Você deve aceitar os termos para continuar' })
  termsAccepted: boolean;
}
