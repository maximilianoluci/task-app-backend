import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { AppError, ErrorCode } from "src/errors/app-error";
import { CreateUserDto } from "./dto/create-user.dto";
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
        } else if (error.code === ErrorCode.FAILED_CREATION) {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }

  @Get(":id")
  @HttpCode(200)
  async read(@Param("id") id: string) {
    try {
      const user = await this.userService.read(id);
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        if (error.code === ErrorCode.USER_NOT_FOUND) {
          throw new BadRequestException([error.message]);
        } else {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }

  @Get()
  @HttpCode(200)
  async getAll() {
    const users = await this.userService.getAll();
    return users;
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async update(
    @Param("id") id: string,
    @Body() user: { name: string; email: string },
  ) {
    try {
      const updatedUser = await this.userService.update({
        id,
        name: user.name,
        email: user.email,
      });
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        if (error.code === ErrorCode.USER_NOT_FOUND) {
          throw new BadRequestException([error.message]);
        } else {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }
}
