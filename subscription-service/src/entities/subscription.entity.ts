import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Frequency } from '../common/enums/frequency.enum';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'city' })
  city: string;

  @Column({ type: 'enum', enum: Frequency })
  frequency: Frequency;

  @Column({ type: 'boolean', default: false, name: 'confirmed' })
  confirmed: boolean;

  @Column({ type: 'varchar', name: 'token' })
  token: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
