import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { AppError, ErrorCode } from "src/errors/app-error";
import { PrismaService } from "src/prisma.service";
import { v4 as uuidv4 } from "uuid";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

const salt = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UpdateUserDto> {
    if (!createUserDto) {
      throw new AppError("User cannot be empty", ErrorCode.MISSING_DATA);
    }

    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new AppError("Passwords don't match", ErrorCode.PASSWORD_NOT_MATCH);
    }

    const encryptedPassword = await bcrypt.hash(createUserDto.password, salt);

    try {
      const id = `U-${uuidv4()}`;

      const prismaUser: Prisma.UserCreateInput = {
        id,
        email: createUserDto.email,
        name: createUserDto.name,
        password: encryptedPassword,
      };

      const newUser = await this.prisma.user.create({ data: prismaUser });

      const createdUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      return createdUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new AppError("User already exists", ErrorCode.ALREADY_EXISTS);
        }
      }
      throw new AppError("Failed to create user", ErrorCode.CREATION_FAILED);
    }
  }

  async findOne(id: string) {
    if (!id) {
      throw new AppError("User ID cannot be empty", ErrorCode.MISSING_DATA);
    }

    const prismaSelectedUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!prismaSelectedUser) {
      throw new AppError("User not found", ErrorCode.NOT_FOUND);
    }

    return {
      id: prismaSelectedUser.id,
      name: prismaSelectedUser.name,
      email: prismaSelectedUser.email,
    };
  }

  async update(id: string, userDto: UpdateUserDto) {
    if (!userDto) {
      throw new AppError("User cannot be empty", ErrorCode.MISSING_DATA);
    }

    try {
      const prismaUpdatedUser = await this.prisma.user.update({
        data: userDto,
        where: { id },
      });

      const updatedUser = {
        id: prismaUpdatedUser.id,
        name: prismaUpdatedUser.name,
        email: prismaUpdatedUser.email,
      };

      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("User not found", ErrorCode.NOT_FOUND);
        }
      }
      throw new AppError("User could not be updated", ErrorCode.UPDATE_FAILED);
    }
  }

  async remove(id: string) {
    if (!id) {
      throw new AppError("User ID cannot be empty", ErrorCode.MISSING_DATA);
    }

    try {
      const prismaUser = await this.prisma.user.delete({
        where: { id },
      });

      const deletedUser = {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
      };

      return deletedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new AppError("User not found", ErrorCode.NOT_FOUND);
        }
      }
      throw new AppError("User could not be deleted", ErrorCode.DELETE_FAILED);
    }
  }
}
