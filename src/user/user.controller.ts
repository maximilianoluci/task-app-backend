import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
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
          error.code === ErrorCode.USER_EXISTS ||
          error.code === ErrorCode.PASSWORD_NOT_MATCH
        ) {
          throw new BadRequestException([error.message]);
        } else if (error.code === ErrorCode.FAILED_USER_CREATION) {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }

  @Put(":id")
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
        throw new InternalServerErrorException([error.message]);
      }
    }
  }
}
