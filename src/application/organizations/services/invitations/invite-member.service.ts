import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { OrganizationMember } from '../../entities/organization-member.entity';
import { OrganizationInvitation, InvitationStatus } from '../../entities/organization-invitation.entity';
import { Organization } from '../../entities/organization.entity';
import { User } from '../../../users/entities/user.entity';
import { EmailService } from '../../../../infrastructure/services/email.service';
import { InviteMemberDto } from '../../dto/invite-member.dto';
import { OrganizationRole } from '@common/enums/user-type.enum';

@Injectable()
export class InviteMemberService {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
    @InjectRepository(OrganizationInvitation)
    private readonly invitationRepo: Repository<OrganizationInvitation>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  async inviteMember(userId: string, organizationId: string, dto: InviteMemberDto) {
    await this._validateInviterPermissions(userId, organizationId);
    await this._validateInvitee(dto.email, organizationId);

    const organization = await this._getOrganization(organizationId);
    const inviter = await this._getUser(userId);

    const invitation = await this._createInvitation(userId, organizationId, dto);
    await this._sendInvitationEmail(invitation, organization, inviter);

    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
    };
  }

  private async _validateInviterPermissions(userId: string, organizationId: string): Promise<void> {
    const membership = await this.memberRepo.findOne({
      where: { userId, organizationId },
    });

    if (!membership || ![OrganizationRole.OWNER, OrganizationRole.ADMIN].includes(membership.role)) {
      throw new ForbiddenException('Only owners and admins can invite members');
    }
  }

  private async _validateInvitee(email: string, organizationId: string): Promise<void> {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      const alreadyMember = await this.memberRepo.findOne({
        where: { userId: existingUser.id, organizationId },
      });
      if (alreadyMember) {
        throw new BadRequestException('User is already a member of this organization');
      }
    }

    const pendingInvitation = await this.invitationRepo.findOne({
      where: { email, organizationId, status: InvitationStatus.PENDING },
    });

    if (pendingInvitation) {
      throw new BadRequestException('An invitation has already been sent to this email');
    }
  }

  private async _getOrganization(organizationId: string): Promise<Organization> {
    const organization = await this.orgRepo.findOne({ where: { id: organizationId } });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  private async _getUser(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async _createInvitation(
    userId: string,
    organizationId: string,
    dto: InviteMemberDto,
  ): Promise<OrganizationInvitation> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = this.invitationRepo.create({
      email: dto.email,
      organizationId,
      invitedById: userId,
      role: dto.role,
      token,
      expiresAt,
      status: InvitationStatus.PENDING,
    });

    return await this.invitationRepo.save(invitation);
  }

  private async _sendInvitationEmail(
    invitation: OrganizationInvitation,
    organization: Organization,
    inviter: User,
  ): Promise<void> {
    const acceptUrl = `${this.config.getOrThrow<string>('APP_URL')}/accept-invitation?token=${invitation.token}`;
    const inviterName = `${inviter.firstName} ${inviter.lastName}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Organization Invitation</h2>
        <p>Hi there,</p>
        <p><strong>${inviterName}</strong> has invited you to join <strong>${organization.name}</strong> on InsureLink.</p>
        <p>Click the button below to accept the invitation:</p>
        <a href="${acceptUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Accept Invitation
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${acceptUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">
          This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `;

    await this.emailService.send(
      invitation.email,
      `You've been invited to join ${organization.name}`,
      html,
    );
  }
}
