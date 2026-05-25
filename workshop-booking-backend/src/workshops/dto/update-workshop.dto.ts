import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkshopDto } from './create-workshop.dto';

// Все поля становятся необязательными (PATCH-семантика)
export class UpdateWorkshopDto extends PartialType(CreateWorkshopDto) {}
