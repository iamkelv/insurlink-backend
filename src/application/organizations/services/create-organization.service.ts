import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { OrganizationMember } from '../entities/organization-member.entity';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { OrganizationRole, MemberStatus } from '@common/enums/user-type.enum';

@Injectable()
export class CreateOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(userId: string, dto: CreateOrganizationDto) {
    const exists = await this.orgRepository.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Organization already exists');

    const org = await this.orgRepository.save(this.orgRepository.create(dto));
    
    await this.memberRepository.save(
      this.memberRepository.create({
        userId,
        organizationId: org.id,
        role: OrganizationRole.OWNER,
        status: MemberStatus.ACTIVE,
      }),
    );

    return org;
  }
}