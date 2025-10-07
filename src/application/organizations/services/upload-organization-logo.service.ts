import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMember } from '../entities/organization-member.entity';
import { Organization } from '../entities/organization.entity';
import { R2StorageService } from '../../../infrastructure/services/r2-storage.service';

@Injectable()
export class UploadOrganizationLogoService {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
    private readonly r2: R2StorageService,
  ) {}

  async upload(userId: string, file: Buffer, filename: string, mimetype: string) {
    if (!file) throw new BadRequestException('Logo file is required');

    // allow only common image types
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed: PNG, JPEG, WEBP');
    }

    // find any organization the user is a member of (same behavior as update service)
    const membership = await this.memberRepository.findOne({
      where: { userId },
      relations: ['organization'],
    });

    if (!membership?.organization) {
      throw new NotFoundException('Organization not found');
    }

    const organization = membership.organization;

    // delete previous logo if exists
    if (organization.logo) {
      try {
        await this.r2.deleteFile(organization.logo);
      } catch (_) {
        // ignore deletion failures
      }
    }

    const logoUrl = await this.r2.uploadFile(file, filename, mimetype, 'org-logos');
    organization.logo = logoUrl;
    await this.orgRepository.save(organization);

    return { logoUrl };
  }
}
