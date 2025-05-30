import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AppError, ErrorCode } from "src/errors/app-error";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { UserSignInDto } from "./dto/user-sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  @HttpCode(200)
  async signIn(@Body() user: UserSignInDto) {
    try {
      const jwtToken = await this.authService.signIn(user.email, user.password);
      return jwtToken;
    } catch (error) {
      if (error instanceof AppError) {
        if (
          error.code === ErrorCode.ALREADY_EXISTS ||
          error.code === ErrorCode.PASSWORD_NOT_MATCH ||
          error.code === ErrorCode.NOT_FOUND
        ) {
          throw new BadRequestException([error.message]);
        } else if (error.code === ErrorCode.CREATION_FAILED) {
          throw new InternalServerErrorException([error.message]);
        }
      }
    }
  }

  @UseGuards(AuthGuard)
  @Put(":id/change-password")
  @HttpCode(200)
  async changePassword(
    @Param("id") id: string,
    @Body()
    user: {
      currentPassword: string;
      newPassword: string;
      newPasswordConfirm: string;
    },
  ) {
    try {
      const updatePassword = await this.authService.changePassword({
        id,
        currentPassword: user.currentPassword,
        newPassword: user.newPassword,
        newPasswordConfirm: user.newPasswordConfirm,
      });
      return updatePassword;
    } catch (error) {
      if (error instanceof AppError) {
        if (error.code !== ErrorCode.INTERNAL_ERROR) {
          throw new BadRequestException([error.message]);
        }
        throw new InternalServerErrorException([error.message]);
      }
    }
  }
}
