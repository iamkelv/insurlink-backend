import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { LoginDto } from '../dto/auth.dto';
import { JwtTokenService } from '../../../infrastructure/services/jwt-token.service';

@Injectable()
export class LoginUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtTokenService.signEncrypted({ sub: user.id, email: user.email, role: user.role });
    return { token };
  }
}