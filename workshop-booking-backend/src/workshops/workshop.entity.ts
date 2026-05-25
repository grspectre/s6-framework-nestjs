import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../bookings/booking.entity';

@Entity('workshops')
export class Workshop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column('text')
  description!: string;

  @Column({ length: 255 })
  instructor!: string;

  @Column()
  date!: Date;

  @Column({ length: 255 })
  location!: string;

  @Column()
  maxParticipants!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Booking, (booking) => booking.workshop, { eager: false })
  bookings!: Booking[];

  // Вычисляемое: не прошёл ли мастер-класс
  get isPast(): boolean {
    return this.date < new Date();
  }

  // Вычисляемое: свободные места
  get availableSpots(): number {
    const booked = this.bookings?.length ?? 0;
    return Math.max(this.maxParticipants - booked, 0);
  }
}