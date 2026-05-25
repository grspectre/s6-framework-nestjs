import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { WorkshopsService } from '../workshops/workshops.service';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly workshopsService: WorkshopsService,
  ) {}

  async findAllForUser(user: User): Promise<Booking[]> {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.workshop', 'workshop')
      .leftJoinAndSelect('workshop.bookings', 'workshopBookings')
      .orderBy('booking.createdAt', 'DESC');

    // Администратор видит все, обычный пользователь — только свои
    if (user.role !== UserRole.ADMIN) {
      query.where('booking.user = :userId', { userId: user.id });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { user: true, workshop: { bookings: true } },
    });
    if (!booking) {
      throw new NotFoundException('Бронирование не найдено.');
    }
    return booking;
  }

  async create(dto: CreateBookingDto, user: User): Promise<Booking> {
    const workshop = await this.workshopsService.findOne(dto.workshopId);

    // Мастер-класс не должен быть в прошлом
    if (workshop.isPast) {
      throw new BadRequestException(
        'Нельзя записаться на мастер-класс, который уже прошёл.',
      );
    }

    // Должны быть свободные места
    if (workshop.availableSpots <= 0) {
      throw new BadRequestException(
        'К сожалению, все места на этот мастер-класс уже заняты.',
      );
    }

    // Проверяем, не записан ли уже пользователь
    const existing = await this.bookingRepository.findOne({
      where: { user: { id: user.id }, workshop: { id: workshop.id } },
    });
    if (existing) {
      throw new ConflictException('Вы уже записаны на этот мастер-класс.');
    }

    const booking = this.bookingRepository.create({ user, workshop });
    const saved = await this.bookingRepository.save(booking);

    // Возвращаем с полными relations
    return this.findOne(saved.id);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }

  // Сериализуем бронирование с вложенным workshop
  toDto(booking: Booking, workshopsService: WorkshopsService) {
    return {
      id: booking.id,
      createdAt: booking.createdAt,
      workshop: workshopsService.toDto(booking.workshop),
    };
  }
}