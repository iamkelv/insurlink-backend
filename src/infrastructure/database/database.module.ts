import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../application/users/entities/user.entity';
import { Organization } from '../../application/organizations/entities/organization.entity';
import { OrganizationMember } from '../../application/organizations/entities/organization-member.entity';
import { OrganizationInvitation } from '../../application/organizations/entities/organization-invitation.entity';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT ?? 5433),
      username: process.env.DATABASE_USER || 'pg',
      password: process.env.DATABASE_PASSWORD || 'insurlink_password',
      database: process.env.DATABASE_NAME || 'insurlink',
      entities: [User, Organization, OrganizationMember, OrganizationInvitation],
      migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
      synchronize: process.env.NODE_ENV !== 'production',
      migrationsRun: process.env.NODE_ENV === 'production',
      logging: true,
    }),
  ],
})
export class DatabaseModule {}

