import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { OrganizationRole, MemberStatus } from '@common/enums/user-type.enum';
import { User } from '../../users/entities/user.entity';
import { Organization } from './organization.entity';

@Entity('organization_members')
@Unique(['userId', 'organizationId'])
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  organizationId: string;

  @Column({ type: 'enum', enum: OrganizationRole, default: OrganizationRole.MEMBER })
  role: OrganizationRole;

  @Column({ type: 'enum', enum: MemberStatus, default: MemberStatus.ACTIVE })
  status: MemberStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
