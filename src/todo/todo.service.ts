import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AppError, ErrorCode } from "src/errors/app-error";
import { PrismaService } from "src/prisma.service";
import { v4 as uuidv4 } from "uuid";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { Priority } from "./dto/todo.dto";
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
        priority: createTodoDto.priority,
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
      throw new AppError("Failed to create todo", ErrorCode.CREATION_FAILED);
    }
  }

  async findAll(listId: string) {
    const prismaTodos = await this.prisma.todo.findMany({
      where: { listId },
    });

    const todos = prismaTodos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      completed: todo.completed,
      priority: todo.priority as Priority,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      listId: todo.listId,
    }));

    return todos;
  }

  async findOne(id: string) {
    if (!id) {
      throw new AppError("Todo id cannot be empty", ErrorCode.MISSING_DATA);
    }
    const prismaTodo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!prismaTodo) {
      throw new AppError("Todo not found", ErrorCode.NOT_FOUND);
    }

    return {
      id: prismaTodo.id,
      title: prismaTodo.title,
      description: prismaTodo.description,
      dueDate: prismaTodo.dueDate,
      completed: prismaTodo.completed,
      priority: prismaTodo.priority as Priority,
      createdAt: prismaTodo.createdAt,
      updatedAt: prismaTodo.updatedAt,
      listId: prismaTodo.listId,
    };
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    if (!updateTodoDto) {
      throw new AppError("Todo cannot be empty", ErrorCode.MISSING_DATA);
    }

    try {
      const prismaUpdatedTodo = await this.prisma.todo.update({
        data: { ...updateTodoDto, updatedAt: new Date().toISOString() },
        where: { id },
      });

      const updatedTodo = {
        id: prismaUpdatedTodo.id,
        title: prismaUpdatedTodo.title,
        description: prismaUpdatedTodo.description,
        dueDate: prismaUpdatedTodo.dueDate,
        completed: prismaUpdatedTodo.completed,
        priority: prismaUpdatedTodo.priority as Priority,
        createdAt: prismaUpdatedTodo.createdAt,
        updatedAt: prismaUpdatedTodo.updatedAt,
      };

      return updatedTodo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("Todo not found", ErrorCode.NOT_FOUND);
        }
      }
      throw new AppError("Todo could not be updated", ErrorCode.UPDATE_FAILED);
    }
  }

  async remove(id: string) {
    if (!id) {
      throw new AppError("Todo id cannot be empty", ErrorCode.MISSING_DATA);
    }

    try {
      const prismaTodo = await this.prisma.todo.delete({
        where: { id },
      });

      const deletedTodo = {
        id: prismaTodo.id,
        title: prismaTodo.title,
        description: prismaTodo.description,
        dueDate: prismaTodo.dueDate,
        completed: prismaTodo.completed,
        priority: prismaTodo.priority as Priority,
        createdAt: prismaTodo.createdAt,
        updatedAt: prismaTodo.updatedAt,
        listId: prismaTodo.listId,
      };

      return deletedTodo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("Todo not found", ErrorCode.NOT_FOUND);
        }
      }
      throw new AppError("Todo could not be deleted", ErrorCode.DELETE_FAILED);
    }
  }
}
