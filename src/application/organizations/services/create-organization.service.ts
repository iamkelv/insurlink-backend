import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { CreateOrganizationDto } from '../dto/create-organization.dto';

@Injectable()
export class CreateOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(userId: string, dto: CreateOrganizationDto) {
    const exists = await this.orgRepository.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Organization already exists');

    const org = await this.orgRepository.save(this.orgRepository.create(dto));
    await this.userRepository.update(userId, { organizationId: org.id });
    return org;
  }
}