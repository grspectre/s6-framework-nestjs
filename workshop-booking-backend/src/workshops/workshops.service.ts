import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop } from './workshop.entity';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,
  ) {}

  async findAll(): Promise<Workshop[]> {
    return this.workshopRepository.find({
      relations: { bookings: true },
      order: { date: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Workshop> {
    const workshop = await this.workshopRepository.findOne({
      where: { id },
      relations: { bookings: true },
    });
    if (!workshop) {
      throw new NotFoundException('Мастер-класс не найден.');
    }
    return workshop;
  }

  async create(dto: CreateWorkshopDto): Promise<Workshop> {
    // Дата не должна быть в прошлом
    if (new Date(dto.date) < new Date()) {
      throw new BadRequestException(
        'Нельзя создать мастер-класс с датой в прошлом.',
      );
    }

    const workshop = this.workshopRepository.create({
      ...dto,
      date: new Date(dto.date),
    });
    return this.workshopRepository.save(workshop);
  }

  async update(id: number, dto: UpdateWorkshopDto): Promise<Workshop> {
    const workshop = await this.findOne(id);

    if (dto.date && new Date(dto.date) < new Date()) {
      throw new BadRequestException(
        'Нельзя установить дату мастер-класса в прошлом.',
      );
    }

    Object.assign(workshop, dto);
    if (dto.date) workshop.date = new Date(dto.date);

    return this.workshopRepository.save(workshop);
  }

  async remove(id: number): Promise<void> {
    const workshop = await this.findOne(id);
    await this.workshopRepository.remove(workshop);
  }

  // Сериализуем с вычисляемыми полями
  toDto(workshop: Workshop) {
    return {
      id: workshop.id,
      title: workshop.title,
      description: workshop.description,
      instructor: workshop.instructor,
      date: workshop.date,
      location: workshop.location,
      maxParticipants: workshop.maxParticipants,
      availableSpots: workshop.availableSpots,
      isPast: workshop.isPast,
      createdAt: workshop.createdAt,
      updatedAt: workshop.updatedAt,
    };
  }
}