import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsController } from './organizations.controller';
import { CreateOrganizationService } from './services/create-organization.service';
import { GetOrganizationService } from './services/get-organization.service';
import { UpdateOrganizationService } from './services/update-organization.service';
import { DeleteOrganizationService } from './services/delete-organization.service';
import { InviteMemberService } from './services/invitations/invite-member.service';
import { AcceptInvitationService } from './services/invitations/accept-invitation.service';
import { Organization } from './entities/organization.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { OrganizationInvitation } from './entities/organization-invitation.entity';
import { User } from '../users/entities/user.entity';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';
import { UploadOrganizationLogoService } from './services/upload-organization-logo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationMember, OrganizationInvitation, User]),
    InfrastructureModule,
  ],
  controllers: [OrganizationsController],
  providers: [
    CreateOrganizationService,
    GetOrganizationService,
    UpdateOrganizationService,
    DeleteOrganizationService,
    InviteMemberService,
    AcceptInvitationService,
    UploadOrganizationLogoService,
  ],
})
export class OrganizationsModule {}