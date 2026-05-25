import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../bookings/booking.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string; // хранится в виде bcrypt-хеша

  @Column({ default: '' })
  firstName!: string;

  @Column({ default: '' })
  lastName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings!: Booking[];

  get isAdminRole(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
