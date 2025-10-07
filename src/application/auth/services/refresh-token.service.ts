import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RefreshTokenDto } from '../dto/auth.dto';
import { JwtTokenService } from '../../../infrastructure/services/jwt-token.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtTokenService.decryptAndVerify(dto.refreshToken);
      
      const user = await this.userRepository.findOne({ 
        where: { id: payload.sub, refreshToken: dto.refreshToken } 
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const token = await this.jwtTokenService.signEncrypted(newPayload);
      const refreshToken = await this.jwtTokenService.signRefreshToken(newPayload);

      user.refreshToken = refreshToken;
      await this.userRepository.save(user);

      return { token, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
