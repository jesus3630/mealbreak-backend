import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Job } from '../jobs/job.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  employees: string;

  @Column({ nullable: true })
  license: string;

  @Column({ nullable: true })
  expires: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true, name: 'careers_url' })
  careersUrl: string;

  @Column({ default: 0, name: 'job_count' })
  jobCount: number;

  @Column({ nullable: true, name: 'job_count_updated_at' })
  jobCountUpdatedAt: Date;

  @OneToMany(() => Job, job => job.company)
  jobs: Job[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
