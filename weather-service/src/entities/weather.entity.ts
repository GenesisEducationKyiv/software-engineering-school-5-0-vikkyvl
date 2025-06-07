import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('weather')
export class Weather {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'city' })
  city: string;

  @Column({ type: 'float', name: 'temperature' })
  temperature: number;

  @Column({ type: 'float', name: 'humidity' })
  humidity: number;

  @Column({ type: 'varchar', name: 'description' })
  description: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;
}
