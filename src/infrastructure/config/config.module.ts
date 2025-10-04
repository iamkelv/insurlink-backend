import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigManagerService } from './config.service';

@Module({
  imports: [NestConfigModule],
  providers: [ConfigManagerService],
  exports: [ConfigManagerService],
})
export class ConfigModule {}

