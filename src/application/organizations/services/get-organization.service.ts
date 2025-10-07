import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMember } from '../entities/organization-member.entity';

@Injectable()
export class GetOrganizationService {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(userId: string) {
    const memberships = await this.memberRepository.find({
      where: { userId },
      relations: ['organization'],
    });

    if (!memberships.length) {
      throw new NotFoundException('No organizations found');
    }

    return memberships.map((m) => ({
      ...m.organization,
      role: m.role,
      status: m.status,
      joinedAt: m.joinedAt,
    }));
  }
}