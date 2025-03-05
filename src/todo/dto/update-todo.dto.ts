import { PartialType } from "@nestjs/mapped-types";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { CreateTodoDto } from "./create-todo.dto";
import { Priority } from "./todo.dto";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
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
}
