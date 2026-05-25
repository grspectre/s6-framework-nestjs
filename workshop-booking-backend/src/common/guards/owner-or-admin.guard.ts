import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../bookings/booking.entity';
import { UserRole } from '../../users/user.entity';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const bookingId = parseInt(request.params.id, 10);

    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Бронирование не найдено.');
    }

    // Администратор имеет доступ ко всему
    if (user.role === UserRole.ADMIN) return true;

    // Обычный пользователь — только к своим
    if (booking.user.id !== user.id) {
      throw new ForbiddenException('Вы не являетесь владельцем этого бронирования.');
    }

    // Прикрепляем бронирование к запросу, чтобы не запрашивать повторно
    request.booking = booking;
    return true;
  }
}