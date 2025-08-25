import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

export enum ApplicationStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export enum ServiceType {
  PASSPORT = 'passport',
  AADHAAR = 'aadhaar',
  DRIVING_LICENSE = 'driving_license',
  PAN_CARD = 'pan_card',
  VOTER_ID = 'voter_id'
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'varchar',
    length: 50
  })
  serviceType: string;

  @Column('json')
  formData: any;

  @Column({
    type: 'varchar',
    length: 50,
    default: ApplicationStatus.DRAFT
  })
  status: ApplicationStatus;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  remarks: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  utrNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
