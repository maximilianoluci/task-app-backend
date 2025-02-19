import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AppError, ErrorCode } from "src/errors/app-error";
import { PrismaService } from "src/prisma.service";
import { v4 as uuidv4 } from "uuid";
import { CreateListDto } from "./dto/create-list.dto";
import { ListDto } from "./dto/list.dto";
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

      const createdList: ListDto = {
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
      throw new AppError("Failed to create todo", ErrorCode.FAILED_CREATION);
    }
  }

  findAll() {
    return `This action returns all list`;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListDto: UpdateListDto) {
    if (!updateListDto) {
      throw new AppError("List cannot be empty", ErrorCode.MISSING_DATA);
    }

    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
