import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { GetCurrentUserService } from './services/get-current-user.service';
import { UpdateUserProfileService } from './services/update-user-profile.service';
import { ChangeUserPasswordService } from './services/change-user-password.service';
import { UploadAvatarService } from './services/upload-avatar.service';
import { User } from './entities/user.entity';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), InfrastructureModule],
  controllers: [UsersController],
  providers: [GetCurrentUserService, UpdateUserProfileService, ChangeUserPasswordService, UploadAvatarService],
})
export class UsersModule {}