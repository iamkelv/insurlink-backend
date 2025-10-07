import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { OrganizationMember } from '../entities/organization-member.entity';
import { OrganizationRole } from '@common/enums/user-type.enum';

@Injectable()
export class DeleteOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(userId: string) {
    const membership = await this.memberRepository.findOne({
      where: { userId },
      relations: ['organization'],
    });

    if (!membership) {
      throw new NotFoundException('Organization not found');
    }

    if (membership.role !== OrganizationRole.OWNER) {
      throw new ForbiddenException('Only owners can delete organization');
    }

    await this.orgRepository.remove(membership.organization);
  }
}