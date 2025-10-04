import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { GetCurrentUserService } from './services/get-current-user.service';
import { UpdateUserProfileService } from './services/update-user-profile.service';
import { ChangeUserPasswordService } from './services/change-user-password.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [GetCurrentUserService, UpdateUserProfileService, ChangeUserPasswordService],
})
export class UsersModule {}