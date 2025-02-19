import { IsDateString, IsString } from "class-validator";

export class CreateListDto {
  @IsString()
  title: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  @IsString()
  userId: string;
}
