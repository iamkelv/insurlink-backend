import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';

@Injectable()
export class UpdateOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(userId: string, dto: UpdateOrganizationDto) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['organization'] });
    if (!user?.organization) throw new NotFoundException('Organization not found');
    Object.assign(user.organization, dto);
    return this.orgRepository.save(user.organization);
  }
}