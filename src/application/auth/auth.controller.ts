import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { RegisterUserService } from './services/register-user.service';
import { LoginUserService } from './services/login-user.service';
import { RefreshTokenService } from './services/refresh-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterUserService,
    private readonly loginService: LoginUserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.registerService.execute(dto);
    return { success: true, message: 'User registered', data: user };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const data = await this.loginService.execute(dto);
    return { success: true, message: 'Login successful', data };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return { success: true, message: 'Logout successful' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    const data = await this.refreshTokenService.execute(dto);
    return { success: true, data };
  }
}