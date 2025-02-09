import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
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
  async signIn(email: string, password: string): Promise<UserDto> {
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

    return user;
  }
}
