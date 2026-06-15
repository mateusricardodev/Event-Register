import { IsIn, IsOptional, IsString } from 'class-validator';

export class ListCheckinDto {
  @IsOptional()
  @IsIn(['all', 'done', 'pending'])
  filter?: 'all' | 'done' | 'pending';

  @IsOptional()
  @IsString()
  search?: string;
}
