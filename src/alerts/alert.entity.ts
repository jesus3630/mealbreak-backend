import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.alerts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true, name: 'company_name' })
  companyName: string;

  @Column({ nullable: true, name: 'job_title' })
  jobTitle: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
