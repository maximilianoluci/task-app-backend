import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AppError, ErrorCode } from "src/errors/app-error";
import { PrismaService } from "src/prisma.service";
import { v4 as uuidv4 } from "uuid";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    if (!createTodoDto) {
      throw new AppError("Todo cannot be empty", ErrorCode.MISSING_DATA);
    }

    try {
      const id = `T-${uuidv4()}`;
      const prismaTodo: Prisma.TodoCreateInput = {
        id,
        title: createTodoDto.title,
        description: createTodoDto.description,
        dueDate: createTodoDto.dueDate,
        completed: createTodoDto.completed,
        createdAt: new Date(),
        updatedAt: new Date(),
        list: {
          connect: {
            id: createTodoDto.listId,
          },
        },
      };

      const newTodo = await this.prisma.todo.create({ data: prismaTodo });

      const createdTodo = {
        id: newTodo.id,
        title: newTodo.title,
        description: newTodo.description,
        dueDate: newTodo.dueDate,
        completed: newTodo.completed,
        createdAt: newTodo.createdAt,
        updatedAt: newTodo.updatedAt,
        listId: newTodo.listId,
      };

      return createdTodo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new AppError("Todo already exists", ErrorCode.ALREADY_EXISTS);
        }
      }
      throw new AppError("Failed to create todo", ErrorCode.FAILED_CREATION);
    }
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
