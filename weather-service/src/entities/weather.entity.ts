import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('weather')
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column('float')
  temperature: number;

  @Column('float')
  humidity: number;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
