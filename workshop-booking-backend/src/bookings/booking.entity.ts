import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Workshop } from '../workshops/workshop.entity';

@Entity('bookings')
@Unique('unique_user_workshop', ['user', 'workshop']) // запрет повторного бронирования
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Workshop, (workshop) => workshop.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  workshop!: Workshop;

  @CreateDateColumn()
  createdAt!: Date;
}
