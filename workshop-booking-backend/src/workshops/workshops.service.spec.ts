import { Test, TestingModule } from '@nestjs/testing';
import { WorkshopsService } from './workshops.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workshop } from './workshop.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // +30 дней
const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24); // -1 день

const mockWorkshop = {
  id: 1,
  title: 'Test Workshop',
  description: 'Описание',
  instructor: 'Иван',
  date: futureDate,
  location: 'Zoom',
  maxParticipants: 10,
  bookings: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  get isPast() {
    return this.date < new Date();
  },
  get availableSpots() {
    return this.maxParticipants - this.bookings.length;
  },
};

const mockRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

describe('WorkshopsService', () => {
  let service: WorkshopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkshopsService,
        { provide: getRepositoryToken(Workshop), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<WorkshopsService>(WorkshopsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('должен вернуть массив мастер-классов', async () => {
      mockRepo.find.mockResolvedValue([mockWorkshop]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('должен вернуть мастер-класс по id', async () => {
      mockRepo.findOne.mockResolvedValue(mockWorkshop);
      const result = await service.findOne(1);
      expect(result.title).toBe('Test Workshop');
    });

    it('должен выбросить NotFoundException если не найден', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('должен создать мастер-класс с будущей датой', async () => {
      mockRepo.create.mockReturnValue(mockWorkshop);
      mockRepo.save.mockResolvedValue(mockWorkshop);

      const result = await service.create({
        title: 'Test',
        description: 'Desc',
        instructor: 'Иван',
        date: futureDate.toISOString(),
        location: 'Zoom',
        maxParticipants: 10,
      });
      expect(result.title).toBe('Test Workshop');
    });

    it('должен выбросить BadRequestException для даты в прошлом', async () => {
      await expect(
        service.create({
          title: 'Test',
          description: 'Desc',
          instructor: 'Иван',
          date: pastDate.toISOString(),
          location: 'Zoom',
          maxParticipants: 10,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('toDto', () => {
    it('должен вернуть объект с availableSpots и isPast', () => {
      const dto = service.toDto(mockWorkshop as any);
      expect(dto).toHaveProperty('availableSpots', 10);
      expect(dto).toHaveProperty('isPast', false);
    });
  });
});
