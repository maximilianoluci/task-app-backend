import { Injectable } from "@nestjs/common";
import { AppError, ErrorCode } from "src/errors/app-error";
import { v4 as uuidv4 } from "uuid";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@Injectable()
export class TodoService {
  create(createTodoDto: CreateTodoDto) {
    if (!createTodoDto) {
      throw new AppError("Todo cannot be empty", ErrorCode.MISSING_DATA);
    }

    try {
      const id = `T-${uuidv4()}`;

      // const prismaTodo: Prisma.TodoCreateInput = {
      //   id,
      //   title: createTodoDto.title,
      //   description: createTodoDto.description,
      //   dueDate: createTodoDto.dueDate,
      //   completed: createTodoDto.completed,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // };
    } catch (error) {}
  }

  findAll() {
    return `This action returns all todo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    if (!updateTodoDto) {
      throw new AppError("Todo cannot be empty", ErrorCode.MISSING_DATA);
    }
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
