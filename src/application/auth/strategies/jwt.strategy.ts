import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { EncryptionService } from '../../../infrastructure/services/encryption.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly encryption: EncryptionService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const authHeader = request.headers.authorization;
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
          }
          const encryptedToken = authHeader.substring(7);
          try {
            return encryption.decrypt(encryptedToken);
          } catch (error) {
            return null;
          }
        },
      ]),
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}