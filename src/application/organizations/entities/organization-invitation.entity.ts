import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrganizationRole } from '@common/enums/user-type.enum';
import { User } from '../../users/entities/user.entity';
import { Organization } from './organization.entity';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

@Entity('organization_invitations')
export class OrganizationInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  organizationId: string;

  @Column()
  invitedById: string;

  @Column({ type: 'enum', enum: OrganizationRole, default: OrganizationRole.MEMBER })
  role: OrganizationRole;

  @Column({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.PENDING })
  status: InvitationStatus;

  @Column({ unique: true })
  token: string;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'invitedById' })
  invitedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
