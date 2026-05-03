import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  bannerUrl?: string;
}
