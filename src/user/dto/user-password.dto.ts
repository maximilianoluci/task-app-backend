import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserPasswordDto {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  password: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  passwordConfirm: string;
}
