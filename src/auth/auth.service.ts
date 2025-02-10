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

    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new AppError(
        "Refresh token secret is not defined",
        ErrorCode.MISSING_DATA,
      );
    }

    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  generateAccessToken(user: UserDto) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      throw new AppError(
        "Access token secret is not defined",
        ErrorCode.MISSING_DATA,
      );
    }

    const expiresIn = process.env.ACCESS_TOKEN_EXPIRATION;
    if (!expiresIn) {
      throw new AppError(
        "Access token expiration is not defined",
        ErrorCode.MISSING_DATA,
      );
    }

    return jwt.sign(user, accessTokenSecret, {
      expiresIn: parseInt(expiresIn, 10),
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    if (!refreshToken) {
      return new AppError("refreshToken is mandatory", ErrorCode.MISSING_DATA);
    }

    const lastUpdate = new Date();

    const prismaUser = await this.prisma.user.update({
      data: { refreshToken, lastUpdate },
      where: { id: userId },
    });

    return prismaUser;
  }
}
