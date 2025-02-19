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

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  dueDate: Date;

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
