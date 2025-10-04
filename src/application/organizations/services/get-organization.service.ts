import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class GetOrganizationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['organization'],
    });
    if (!user?.organization) throw new NotFoundException('Organization not found');
    return user.organization;
  }
}