import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serviceType: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'submitted', 'in_progress', 'approved', 'rejected'],
    default: 'draft',
  })
  status: string;

  @Column({ type: 'jsonb' })
  data: any;

  @ManyToOne(() => User, user => user.applications)
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
