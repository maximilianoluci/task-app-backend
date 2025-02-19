import {
  IsBoolean,
  IsDate,
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

  @IsDate()
  dueDate: Date;

  @IsBoolean()
  completed: boolean;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  listId: string;
}
