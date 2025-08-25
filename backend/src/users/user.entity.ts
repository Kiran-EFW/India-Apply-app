import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  aadhaar: string;

  @Column({ type: 'jsonb', nullable: true })
  profile: any;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Application, application => application.user)
  applications: Application[];
}
