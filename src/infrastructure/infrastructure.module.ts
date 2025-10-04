import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from './services/encryption.service';
import { JwtTokenService } from './services/jwt-token.service';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION') || '1d' },
      }),
    }),
  ],
  providers: [EncryptionService, JwtTokenService],
  exports: [EncryptionService, JwtTokenService, JwtModule, ConfigModule],
})
export class InfrastructureModule {}
