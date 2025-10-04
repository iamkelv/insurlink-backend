import { Controller, Get, Post, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateOrganizationService } from './services/create-organization.service';
import { GetOrganizationService } from './services/get-organization.service';
import { UpdateOrganizationService } from './services/update-organization.service';
import { DeleteOrganizationService } from './services/delete-organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly create: CreateOrganizationService,
    private readonly get: GetOrganizationService,
    private readonly update: UpdateOrganizationService,
    private readonly deleteService: DeleteOrganizationService,
  ) {}

  @Post()
  async createOrg(@CurrentUser() user: any, @Body() dto: CreateOrganizationDto) {
    const data = await this.create.execute(user.id, dto);
    return { success: true, message: 'Organization created', data };
  }

  @Get('me')
  async getOrg(@CurrentUser() user: any) {
    const data = await this.get.execute(user.id);
    return { success: true, data };
  }

  @Put('me')
  async updateOrg(@CurrentUser() user: any, @Body() dto: UpdateOrganizationDto) {
    const data = await this.update.execute(user.id, dto);
    return { success: true, message: 'Organization updated', data };
  }

  @Delete('me')
  async deleteOrg(@CurrentUser() user: any) {
    await this.deleteService.execute(user.id);
    return { success: true, message: 'Organization deleted' };
  }
}