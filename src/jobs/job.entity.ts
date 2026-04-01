import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  source: string;

  @ManyToOne(() => Company, company => company.jobs, { onDelete: 'CASCADE' })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;
}
