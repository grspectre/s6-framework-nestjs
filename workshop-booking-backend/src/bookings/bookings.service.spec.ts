import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { WorkshopsService } from '../workshops/workshops.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../users/user.entity';

const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

const mockUser = {
  id: 1,
  username: 'testuser',
  role: UserRole.USER,
};

const mockWorkshop = {
  id: 1,
  title: 'Test',
  description: 'Desc',
  instructor: 'Иван',
  date: futureDate,
  location: 'Zoom',
  maxParticipants: 10,
  bookings: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  get isPast() { return this.date < new Date(); },
  get availableSpots() { return this.maxParticipants - this.bookings.length; },
};

const mockBooking = {
  id: 1,
  user: mockUser,
  workshop: mockWorkshop,
  createdAt: new Date(),
};

const mockBookingRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockWorkshopsService = {
  findOne: jest.fn(),
  toDto: jest.fn((w) => ({ id: w.id, title: w.title })),
};

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepo },
        { provide: WorkshopsService, useValue: mockWorkshopsService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('должен создать бронирование', async () => {
      mockWorkshopsService.findOne.mockResolvedValue(mockWorkshop);
      mockBookingRepo.findOne
        .mockResolvedValueOnce(null)   // проверка дубля
        .mockResolvedValueOnce(mockBooking); // финальный findOne
      mockBookingRepo.create.mockReturnValue(mockBooking);
      mockBookingRepo.save.mockResolvedValue(mockBooking);

      const result = await service.create({ workshopId: 1 }, mockUser as any);
      expect(result.id).toBe(1);
    });

    it('должен выбросить ConflictException при повторном бронировании', async () => {
      mockWorkshopsService.findOne.mockResolvedValue(mockWorkshop);
      mockBookingRepo.findOne.mockResolvedValue(mockBooking); // уже есть

      await expect(
        service.create({ workshopId: 1 }, mockUser as any),
      ).rejects.toThrow(ConflictException);
    });

    it('должен выбросить BadRequestException для прошедшего мастер-класса', async () => {
      const pastWorkshop = {
        ...mockWorkshop,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        get isPast() { return true; },
      };
      mockWorkshopsService.findOne.mockResolvedValue(pastWorkshop);

      await expect(
        service.create({ workshopId: 1 }, mockUser as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('должен выбросить BadRequestException при отсутствии мест', async () => {
      const fullWorkshop = {
        ...mockWorkshop,
        bookings: Array(10).fill({}),
        get isPast() { return false; },
        get availableSpots() { return 0; },
      };
      mockWorkshopsService.findOne.mockResolvedValue(fullWorkshop);

      await expect(
        service.create({ workshopId: 1 }, mockUser as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('должен выбросить NotFoundException', async () => {
      mockBookingRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});