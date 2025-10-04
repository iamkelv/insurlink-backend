import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { RegisterDto } from '../dto/auth.dto';
import { JwtTokenService } from '../../../infrastructure/services/jwt-token.service';

@Injectable()
export class RegisterUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(dto: RegisterDto) {
    await this._checkUserExists(dto.email, dto.phone);

    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password: await bcrypt.hash(dto.password, 10),
    });

    await this.userRepository.save(user);

    const token = await this.jwtTokenService.signEncrypted({ sub: user.id, email: user.email, role: user.role });
    const { password, ...safeUser } = user as any;
    return { user: safeUser, token };
  }

  private async _checkUserExists(email: string, phone: string) {
    const exists = await this.userRepository.findOne({
      where: [
        { email },
        { phone }
      ]
    });
    
    if (exists) {
      throw new ConflictException(
        exists.email === email 
          ? 'User with this email already exists' 
          : 'User with this phone number already exists'
      );
    }
  }
}