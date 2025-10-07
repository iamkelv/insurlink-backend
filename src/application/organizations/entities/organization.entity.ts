import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { KybStatus } from '@common/enums/user-type.enum';
import { OrganizationMember } from './organization-member.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ type: 'enum', enum: KybStatus, default: KybStatus.PENDING })
  kybStatus: KybStatus;

  @Column({ type: 'text', nullable: true })
  logo: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}