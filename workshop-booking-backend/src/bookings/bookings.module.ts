import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { WorkshopsModule } from '../workshops/workshops.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), WorkshopsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [TypeOrmModule], // экспортируем репозиторий для OwnerOrAdminGuard
})
export class BookingsModule {}
