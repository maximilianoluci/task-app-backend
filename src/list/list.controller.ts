import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateListDto } from "./dto/create-list.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { ListService } from "./list.service";

@Controller("list")
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  findAll(userId: string) {
    return this.listService.findAll(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.listService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(id, updateListDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.listService.remove(id);
  }
}
