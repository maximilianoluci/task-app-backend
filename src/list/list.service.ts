import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AppError, ErrorCode } from "src/errors/app-error";
import { PrismaService } from "src/prisma.service";
import { v4 as uuidv4 } from "uuid";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async create(createListDto: CreateListDto) {
    if (!createListDto) {
      throw new AppError("List cannot be empty", ErrorCode.MISSING_DATA);
    }

    try {
      const id = `L-${uuidv4()}`;

      const prismaList: Prisma.ListCreateInput = {
        id,
        title: createListDto.title,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          connect: {
            id: createListDto.userId,
          },
        },
      };

      const newList = await this.prisma.list.create({ data: prismaList });

      const createdList = {
        id: newList.id,
        title: newList.title,
        createdAt: newList.createdAt,
        updatedAt: newList.updatedAt,
        userId: newList.userId,
      };

      return createdList;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new AppError("Todo already exists", ErrorCode.ALREADY_EXISTS);
        }
      }
      throw new AppError("Failed to create todo", ErrorCode.CREATION_FAILED);
    }
  }

  async findAll(userId: string) {
    const prismaLists = await this.prisma.list.findMany({
      where: { userId },
    });

    const lists = prismaLists.map((list) => ({
      id: list.id,
      title: list.title,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      userId: list.userId,
    }));

    return lists;
  }

  async findOne(id: string) {
    if (!id) {
      throw new AppError("List id cannot be empty", ErrorCode.MISSING_DATA);
    }

    const prismaList = await this.prisma.list.findUnique({
      where: { id },
    });

    if (!prismaList) {
      throw new AppError("List not found", ErrorCode.NOT_FOUND);
    }

    return {
      id: prismaList.id,
      title: prismaList.title,
      createdAt: prismaList.createdAt,
      updatedAt: prismaList.updatedAt,
      userId: prismaList.userId,
    };
  }

  async update(id: string, updateListDto: UpdateListDto) {
    if (!updateListDto) {
      throw new AppError("List cannot be empty", ErrorCode.MISSING_DATA);
    }

    try {
      const prismaUpdatedList = await this.prisma.list.update({
        data: { ...updateListDto, updatedAt: new Date().toISOString() },
        where: { id },
      });

      const updatedList = {
        id: prismaUpdatedList.id,
        title: prismaUpdatedList.title,
        createdAt: prismaUpdatedList.createdAt,
        updatedAt: prismaUpdatedList.updatedAt,
        userId: prismaUpdatedList.userId,
      };

      return updatedList;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("List not found", ErrorCode.NOT_FOUND);
        }
      }
      throw new AppError("List could not be updated", ErrorCode.UPDATE_FAILED);
    }
  }

  async remove(id: string) {
    if (!id) {
      throw new AppError("List id cannot be empty", ErrorCode.MISSING_DATA);
    }

    try {
      const prismaDeletedList = await this.prisma.list.delete({
        where: { id },
      });

      const deletedList = {
        id: prismaDeletedList.id,
        title: prismaDeletedList.title,
        createdAt: prismaDeletedList.createdAt,
        updatedAt: prismaDeletedList.updatedAt,
        userId: prismaDeletedList.userId,
      };

      return deletedList;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("List not found", ErrorCode.NOT_FOUND);
        }
      }
      throw new AppError("List could not be deleted", ErrorCode.DELETE_FAILED);
    }
  }
}
