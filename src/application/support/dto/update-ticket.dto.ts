import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsIn(['opened', 'answered', 'closed'])
  status?: 'opened' | 'answered' | 'closed';
}

