import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Frequency } from '../../../../common/shared';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'city' })
  city: string;

  @Column({ type: 'enum', enum: Frequency, name: 'frequency' })
  frequency: Frequency;

  @Column({ type: 'boolean', default: false, name: 'confirmed' })
  confirmed: boolean;

  @Column({ type: 'varchar', name: 'token' })
  token: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
