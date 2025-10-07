import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { OrganizationMember } from '../entities/organization-member.entity';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationRole } from '@common/enums/user-type.enum';

@Injectable()
export class UpdateOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(userId: string, dto: UpdateOrganizationDto) {
    const membership = await this.memberRepository.findOne({
      where: { userId },
      relations: ['organization'],
    });

    if (!membership) {
      throw new NotFoundException('Organization not found');
    }

    if (![OrganizationRole.OWNER, OrganizationRole.ADMIN].includes(membership.role)) {
      throw new ForbiddenException('Only owners and admins can update organization');
    }

    Object.assign(membership.organization, dto);
    return this.orgRepository.save(membership.organization);
  }
}