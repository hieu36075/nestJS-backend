import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryRoomSerive } from './categoryRoom.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator';
import { MyJwtGuard } from 'src/common/guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Public } from 'src/common/decorator/public.decorator';
import { PaginationResult } from 'src/common/interface/pagination.interface';
import { CategoryRoom } from '@prisma/client';

@Controller('categoryRoom')
@ApiTags('CategoryRoom')
@ApiBearerAuth('Jwt-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class CategoryRoomController {
  constructor(private categoryRoomSerivce: CategoryRoomSerive) {}

  @Public()
  @Get()
  async getCategoryRoom(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<PaginationResult<CategoryRoom>>{
    return this.categoryRoomSerivce.getAll(page, perPage);
  }
}
