import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../application/users/entities/user.entity';
import { Organization } from '../../application/organizations/entities/organization.entity';
import { OrganizationMember } from '../../application/organizations/entities/organization-member.entity';
import { OrganizationInvitation } from '../../application/organizations/entities/organization-invitation.entity';
import { Ticket } from '../../application/support/entities/ticket.entity';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: Number(configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Organization, OrganizationMember, OrganizationInvitation, Ticket],
        migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        migrationsRun: configService.get<string>('NODE_ENV') === 'production',
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

