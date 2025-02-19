import { IsDateString, IsString } from "class-validator";

export class ListDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  @IsString()
  userId: string;
}
