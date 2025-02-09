import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from "@nestjs/common";
import { AppError } from "src/errors/app-error";
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
    } catch (error: any) {
      if (error instanceof AppError) {
        if (error.code === 1000 || error.code === 1020) {
          throw new BadRequestException([error.message]);
        } else if (error.code === 1010) {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }
}
