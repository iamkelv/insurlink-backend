import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './application/auth/auth.module';
import { UsersModule } from './application/users/users.module';
import { OrganizationsModule } from './application/organizations/organizations.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { SupportModule } from './application/support/support.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    SupportModule,
  ],
})
export class AppModule {}