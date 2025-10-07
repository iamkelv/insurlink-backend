import { Controller, Get, Post, Put, Delete, Body, UseGuards, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express as ExpressNS } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateOrganizationService } from './services/create-organization.service';
import { GetOrganizationService } from './services/get-organization.service';
import { UpdateOrganizationService } from './services/update-organization.service';
import { DeleteOrganizationService } from './services/delete-organization.service';
import { InviteMemberService } from './services/invitations/invite-member.service';
import { AcceptInvitationService } from './services/invitations/accept-invitation.service';
import { UploadOrganizationLogoService } from './services/upload-organization-logo.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InviteMemberDto, AcceptInvitationDto } from './dto/invite-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly createOrganizationService: CreateOrganizationService,
    private readonly getUserOrganizationsService: GetOrganizationService,
    private readonly updateOrganizationService: UpdateOrganizationService,
    private readonly deleteOrganizationService: DeleteOrganizationService,
    private readonly inviteMember: InviteMemberService,
    private readonly acceptInvitation: AcceptInvitationService,
    private readonly uploadOrganizationLogo: UploadOrganizationLogoService,
  ) {}

  @Post()
  async createOrg(@CurrentUser() user: any, @Body() dto: CreateOrganizationDto) {
    const data = await this.createOrganizationService.execute(user.id, dto);
    return { success: true, message: 'Organization created', data };
  }

  @Get('me')
  async getOrg(@CurrentUser() user: any) {
    const data = await this.getUserOrganizationsService.execute(user.id);
    return { success: true, data };
  }

  @Put('me')
  async updateOrg(@CurrentUser() user: any, @Body() dto: UpdateOrganizationDto) {
    const data = await this.updateOrganizationService.execute(user.id, dto);
    return { success: true, message: 'Organization updated', data };
  }

  @Delete('me')
  async deleteOrg(@CurrentUser() user: any) {
    await this.deleteOrganizationService.execute(user.id);
    return { success: true, message: 'Organization deleted' };
  }

  @Post('me/logo')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @CurrentUser() user: any,
    @UploadedFile() file: any,
  ) {
    const data = await this.uploadOrganizationLogo.upload(
      user.id,
      file.buffer,
      file.originalname,
      file.mimetype,
    );
    return { success: true, message: 'Logo uploaded', data };
  }

  @Post(':organizationId/invite')
  async invite(
    @CurrentUser() user: any,
    @Param('organizationId') organizationId: string,
    @Body() dto: InviteMemberDto,
  ) {
    const data = await this.inviteMember.inviteMember(user.id, organizationId, dto);
    return { success: true, message: 'Invitation sent', data };
  }

  @Post('accept-invitation')
  async accept(@CurrentUser() user: any, @Body() dto: AcceptInvitationDto) {
    const data = await this.acceptInvitation.acceptInvitation(user.id, dto);
    return { success: true, message: 'Invitation accepted', data };
  }
}