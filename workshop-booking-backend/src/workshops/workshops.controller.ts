import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  // GET /api/workshops/ — публичный
  @Get()
  async findAll() {
    const workshops = await this.workshopsService.findAll();
    return workshops.map((w) => this.workshopsService.toDto(w));
  }

  // GET /api/workshops/:id — публичный
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const workshop = await this.workshopsService.findOne(id);
    return this.workshopsService.toDto(workshop);
  }

  // POST /api/workshops/ — только admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() dto: CreateWorkshopDto) {
    const workshop = await this.workshopsService.create(dto);
    return this.workshopsService.toDto(workshop);
  }

  // PUT /api/workshops/:id — только admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkshopDto,
  ) {
    const workshop = await this.workshopsService.update(id, dto);
    return this.workshopsService.toDto(workshop);
  }

  // DELETE /api/workshops/:id — только admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.workshopsService.remove(id);
  }
}
