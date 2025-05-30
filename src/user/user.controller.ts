import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { AppError, ErrorCode } from "src/errors/app-error";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);
      return newUser;
    } catch (error) {
      if (error instanceof AppError) {
        if (
          error.code === ErrorCode.ALREADY_EXISTS ||
          error.code === ErrorCode.PASSWORD_NOT_MATCH
        ) {
          throw new BadRequestException([error.message]);
        } else if (error.code === ErrorCode.CREATION_FAILED) {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }

  @Get(":id")
  @HttpCode(200)
  async findOne(@Param("id") id: string) {
    try {
      const user = await this.userService.findOne(id);
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        if (error.code === ErrorCode.NOT_FOUND) {
          throw new BadRequestException([error.message]);
        } else {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async update(@Param("id") id: string, @Body() user: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.update(id, user);
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        if (error.code === ErrorCode.NOT_FOUND) {
          throw new BadRequestException([error.message]);
        } else {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async remove(@Param("id") id: string) {
    try {
      const deletedUser = await this.userService.remove(id);
      return deletedUser;
    } catch (error) {
      if (error instanceof AppError) {
        if (error.code === ErrorCode.NOT_FOUND) {
          throw new BadRequestException([error.message]);
        } else {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }
}
