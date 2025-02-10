import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class UserPasswordDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  newPasswordConfirm: string;
}
