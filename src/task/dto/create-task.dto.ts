import { Priority } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  taskName: string;

  @IsString()
  @IsOptional()
  taskDesc?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(Priority), {
    message: 'Priority must be either "LOW" or "MEDIUM" or "HIGH"',
  })
  priority: Priority;

  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;
}
