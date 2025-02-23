import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { Priority } from "./todo.dto";

export class UpdateTodoDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsDateString()
  @IsOptional()
  dueDate?: Date | null;

  @IsBoolean()
  completed: boolean;

  @IsEnum(Priority)
  priority: Priority;

  @IsDateString()
  updatedAt: Date;
}
