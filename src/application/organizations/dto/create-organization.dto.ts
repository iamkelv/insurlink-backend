import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  @IsOptional()
  logo?: string;
}
