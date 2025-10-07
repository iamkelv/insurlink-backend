import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMember } from '../../entities/organization-member.entity';
import { OrganizationInvitation, InvitationStatus } from '../../entities/organization-invitation.entity';
import { User } from '../../../users/entities/user.entity';
import { MemberStatus } from '@common/enums/user-type.enum';
import { AcceptInvitationDto } from '../../dto/invite-member.dto';

@Injectable()
export class AcceptInvitationService {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly memberRepo: Repository<OrganizationMember>,
    @InjectRepository(OrganizationInvitation)
    private readonly invitationRepo: Repository<OrganizationInvitation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async acceptInvitation(userId: string, dto: AcceptInvitationDto) {
    const invitation = await this._validateInvitation(dto.token);
    const user = await this._validateUser(userId, invitation);

    await this._checkExistingMembership(userId, invitation.organizationId);

    const member = await this._createMembership(userId, invitation);
    await this._markInvitationAsAccepted(invitation);

    return {
      organization: invitation.organization,
      role: member.role,
      joinedAt: member.joinedAt,
    };
  }

  private async _validateInvitation(token: string): Promise<OrganizationInvitation> {
    const invitation = await this.invitationRepo.findOne({
      where: { token },
      relations: ['organization'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('This invitation is no longer valid');
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = InvitationStatus.EXPIRED;
      await this.invitationRepo.save(invitation);
      throw new BadRequestException('This invitation has expired');
    }

    return invitation;
  }

  private async _validateUser(userId: string, invitation: OrganizationInvitation): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email !== invitation.email) {
      throw new BadRequestException('This invitation was sent to a different email address');
    }

    return user;
  }

  private async _checkExistingMembership(userId: string, organizationId: string): Promise<void> {
    const existingMember = await this.memberRepo.findOne({
      where: { userId, organizationId },
    });

    if (existingMember) {
      throw new BadRequestException('You are already a member of this organization');
    }
  }

  private async _createMembership(
    userId: string,
    invitation: OrganizationInvitation,
  ): Promise<OrganizationMember> {
    const member = this.memberRepo.create({
      userId,
      organizationId: invitation.organizationId,
      role: invitation.role,
      status: MemberStatus.ACTIVE,
    });

    return await this.memberRepo.save(member);
  }

  private async _markInvitationAsAccepted(invitation: OrganizationInvitation): Promise<void> {
    invitation.status = InvitationStatus.ACCEPTED;
    await this.invitationRepo.save(invitation);
  }
}
