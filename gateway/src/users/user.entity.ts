import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'bigint', unique: true })
    telegramId: string; // TypeORM uses string for bigint to avoid overflow in JS

    @Column({ nullable: true })
    username: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @CreateDateColumn()
    createdAt: Date;
}
