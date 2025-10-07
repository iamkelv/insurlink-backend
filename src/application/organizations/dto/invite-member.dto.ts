import { IsEmail, IsEnum, IsNotEmpty, IsIn } from 'class-validator';
import { OrganizationRole } from '@common/enums/user-type.enum';

export class InviteMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsEnum(OrganizationRole)
  @IsIn([OrganizationRole.ADMIN, OrganizationRole.MEMBER])
  @IsNotEmpty()
  role!: OrganizationRole;
}

export class AcceptInvitationDto {
  @IsNotEmpty()
  token!: string;
}
