/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { AppError, ErrorCode } from "src/errors/app-error";
import { PrismaService } from "src/prisma.service";
import { UserDto } from "src/user/dto/user.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validates password and email.
   * @param user contains credentials
   */
  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!email || !password) {
      throw new AppError(
        "Email and password are mandatory",
        ErrorCode.MISSING_DATA,
      );
    }

    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      throw new AppError("User not found", ErrorCode.USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, prismaUser.password);

    if (!isMatch) {
      throw new AppError("User not found", ErrorCode.USER_NOT_FOUND);
    }

    const user: UserDto = {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
    };

    const accessToken = this.generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  generateAccessToken(user: UserDto) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    if (!refreshToken) {
      return new AppError("refreshToken is mandatory", ErrorCode.MISSING_DATA);
    }

    const prismaUser = await this.prisma.user.update({
      data: { refreshToken },
      where: { id: userId },
    });

    return prismaUser;
  }
}
