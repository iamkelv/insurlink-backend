import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BeforeInsert, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  subject: string;

  @Column('text')
  message: string;

  @Column({ unique: true })
  ticketId: string;

  @Column({
    type: 'enum',
    enum: ['opened', 'answered', 'closed'],
    default: 'opened',
  })
  status: 'opened' | 'answered' | 'closed';

  @ManyToOne(() => User, (user) => user.tickets, { onDelete: 'CASCADE' })
  user: User;

  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}
