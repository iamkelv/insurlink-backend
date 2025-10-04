import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { RegisterUserService } from './services/register-user.service';
import { LoginUserService } from './services/login-user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/entities/user.entity';
import { InfrastructureModule } from '../../infrastructure/infrastructure.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    InfrastructureModule,
  ],
  controllers: [AuthController],
  providers: [RegisterUserService, LoginUserService, JwtStrategy],
})
export class AuthModule {}