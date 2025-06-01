import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    city: string;

    @Column()
    frequency: 'daily' | 'hourly';

    @Column({ default: false })
    confirmed: boolean;

    @Column()
    token: string;

    @CreateDateColumn()
    createdAt: Date;
}