import { IsDateString, IsString, IsUUID } from "class-validator";

export class ListDto {
  @IsUUID()
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
