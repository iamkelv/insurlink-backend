import { Controller, Get, Put, Post, Body, UseGuards, BadRequestException, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GetCurrentUserService } from './services/get-current-user.service';
import { UpdateUserProfileService } from './services/update-user-profile.service';
import { ChangeUserPasswordService } from './services/change-user-password.service';
import { UploadAvatarService } from './services/upload-avatar.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly getCurrentUser: GetCurrentUserService,
    private readonly updateProfile: UpdateUserProfileService,
    private readonly changePassword: ChangeUserPasswordService,
    private readonly uploadAvatar: UploadAvatarService,
  ) {}

  @Get('me')
  async getMe(@CurrentUser() user: any) {
    const data = await this.getCurrentUser.execute(user.id);
    return { success: true, data };
  }

  @Put('me')
  async updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    const data = await this.updateProfile.execute(user.id, dto);
    return { success: true, message: 'Profile updated', data };
  }

  @Put('me/password')
  async updatePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    await this.changePassword.execute(user.id, dto);
    return { success: true, message: 'Password changed' };
  }

  @Post('me/avatar')
  async uploadUserAvatar(
    @CurrentUser() user: any,
    @Req() request: FastifyRequest,
  ) {
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('Avatar file is required');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(data.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }

    const buffer = await data.toBuffer();
    
    const maxSize = 5 * 1024 * 1024;
    if (buffer.length > maxSize) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    const result = await this.uploadAvatar.execute(
      user.id,
      buffer,
      data.filename,
      data.mimetype,
    );

    return { success: true, message: 'Avatar uploaded successfully', data: result };
  }
}