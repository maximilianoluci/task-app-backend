import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoService } from "./todo.service";

@Controller("todo")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.todoService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update({
      id,
      title: updateTodoDto.title,
      description: updateTodoDto.description,
      dueDate: updateTodoDto.dueDate,
      completed: updateTodoDto.completed,
      updatedAt: updateTodoDto.updatedAt,
      priority: updateTodoDto.priority,
    });
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.todoService.remove(id);
  }
}
