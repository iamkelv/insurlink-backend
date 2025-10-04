import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsController } from './organizations.controller';
import { CreateOrganizationService } from './services/create-organization.service';
import { GetOrganizationService } from './services/get-organization.service';
import { UpdateOrganizationService } from './services/update-organization.service';
import { DeleteOrganizationService } from './services/delete-organization.service';
import { Organization } from './entities/organization.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User])],
  controllers: [OrganizationsController],
  providers: [CreateOrganizationService, GetOrganizationService, UpdateOrganizationService, DeleteOrganizationService],
})
export class OrganizationsModule {}