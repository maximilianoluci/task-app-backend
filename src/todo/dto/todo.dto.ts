import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";

export enum Priority {
  LOW,
  MEDIUM,
  HIGH,
}

export class TodoDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsBoolean()
  completed: boolean;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  @IsString()
  listId: string;
}
