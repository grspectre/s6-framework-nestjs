import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerOrAdminGuard } from '../common/guards/owner-or-admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { WorkshopsService } from '../workshops/workshops.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard) // все эндпоинты требуют авторизации
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly workshopsService: WorkshopsService,
  ) {}

  // GET /api/bookings/
  @Get()
  async findAll(@CurrentUser() user: User) {
    const bookings = await this.bookingsService.findAllForUser(user);
    return bookings.map((b) =>
      this.bookingsService.toDto(b, this.workshopsService),
    );
  }

  // GET /api/bookings/:id
  @Get(':id')
  @UseGuards(OwnerOrAdminGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const booking = await this.bookingsService.findOne(id);
    return this.bookingsService.toDto(booking, this.workshopsService);
  }

  // POST /api/bookings/
  @Post()
  async create(@Body() dto: CreateBookingDto, @CurrentUser() user: User) {
    const booking = await this.bookingsService.create(dto, user);
    return this.bookingsService.toDto(booking, this.workshopsService);
  }

  // DELETE /api/bookings/:id
  @Delete(':id')
  @UseGuards(OwnerOrAdminGuard)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.bookingsService.remove(id);
  }
}
