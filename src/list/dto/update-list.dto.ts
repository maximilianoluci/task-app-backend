import { PartialType } from "@nestjs/mapped-types";
import { IsDateString, IsString } from "class-validator";
import { CreateListDto } from "./create-list.dto";

export class UpdateListDto extends PartialType(CreateListDto) {
  @IsString()
  title: string;

  @IsDateString()
  updatedAt: Date;
}
