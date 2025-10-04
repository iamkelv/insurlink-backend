import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class DeleteOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['organization'] });
    if (!user?.organization) throw new NotFoundException('Organization not found');
    await this.orgRepository.remove(user.organization);
  }
}