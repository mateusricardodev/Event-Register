import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}
