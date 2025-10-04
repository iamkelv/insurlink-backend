import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from './encryption.service';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly encryption: EncryptionService,
  ) {}

  async signEncrypted(payload: JwtPayload): Promise<string> {
    const jwt = await this.jwt.signAsync(payload);
    return this.encryption.encrypt(jwt);
  }

  async decryptAndVerify(token: string): Promise<JwtPayload> {
    const decrypted = this.encryption.decrypt(token);
    return this.jwt.verifyAsync<JwtPayload>(decrypted);
  }
}
