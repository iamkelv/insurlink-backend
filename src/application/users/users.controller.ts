import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GetCurrentUserService } from './services/get-current-user.service';
import { UpdateUserProfileService } from './services/update-user-profile.service';
import { ChangeUserPasswordService } from './services/change-user-password.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly getCurrentUser: GetCurrentUserService,
    private readonly updateProfile: UpdateUserProfileService,
    private readonly changePassword: ChangeUserPasswordService,
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
}