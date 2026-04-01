import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Alert } from '../alerts/alert.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ type: 'simple-array', nullable: true, name: 'saved_companies' })
  savedCompanies: number[];

  @Column({ type: 'simple-array', nullable: true, name: 'saved_searches' })
  savedSearches: string[];

  @OneToMany(() => Alert, alert => alert.user)
  alerts: Alert[];

  @CreateDateColumn()
  createdAt: Date;
}
