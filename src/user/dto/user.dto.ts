import { IsEmail, IsString, IsUUID } from "class-validator";

export class UserDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
