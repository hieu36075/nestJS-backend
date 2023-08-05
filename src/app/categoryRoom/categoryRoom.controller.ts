import { Controller, Get } from '@nestjs/common';
import { CategoryRoomSerive } from './categoryRoom.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('categoryRoom')
@ApiTags('CategoryRoom')
export class CategoryRoomController {
  constructor(private categoryRoomSerivce: CategoryRoomSerive) {}

  @Get()
  async getCategoryRoom() {
    return this.categoryRoomSerivce.getAll();
  }
}
