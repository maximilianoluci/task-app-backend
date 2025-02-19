import { IsDate, IsString } from "class-validator";

export class ListDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  userId: string;
}
