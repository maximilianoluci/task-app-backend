import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

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
