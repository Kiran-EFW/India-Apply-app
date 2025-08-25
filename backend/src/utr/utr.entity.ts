import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class UTR {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  utrNumber: string;

  @Column()
  userId: string;

  @Column()
  paymentId: string;

  @Column()
  orderId: string;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ['success', 'failed', 'pending'],
    default: 'success',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
