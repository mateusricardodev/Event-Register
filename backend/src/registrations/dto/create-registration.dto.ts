import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRegistrationDto {
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsUUID()
  @IsNotEmpty()
  ticketId: string;
}
