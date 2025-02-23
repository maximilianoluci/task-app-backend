import { PartialType } from "@nestjs/mapped-types";
import { IsDateString, IsString, IsUUID } from "class-validator";
import { CreateListDto } from "./create-list.dto";

export class UpdateListDto extends PartialType(CreateListDto) {
  @IsUUID()
  id: string;

  @IsString()
  title: string;

  @IsDateString()
  updatedAt: Date;
}
