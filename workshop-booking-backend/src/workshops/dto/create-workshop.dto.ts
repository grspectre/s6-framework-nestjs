import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateWorkshopDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  instructor!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsInt()
  @IsPositive()
  maxParticipants!: number;
}
