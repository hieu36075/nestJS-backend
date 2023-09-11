import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryRoomSerive } from './categoryRoom.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator';
import { MyJwtGuard } from 'src/common/guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Public } from 'src/common/decorator/public.decorator';
import { PaginationResult } from 'src/common/interface/pagination.interface';
import { CategoryRoom } from '@prisma/client';
import { CreateCategoryRoomDTO } from './dto/create.categoryRoom.dto';

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

  @Public()
  @Get('get-by-hotel')
  async getCategoryRoomByHotel(
    @Query('hotelId') hotelId: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<PaginationResult<CategoryRoom>>{
    return this.categoryRoomSerivce.getByHotelId(hotelId, page, perPage);
  }

  @Public()
  @Post()
  async createCategoryRoom(@Body() createCategoryRoomDTO: CreateCategoryRoomDTO){
    return await this.categoryRoomSerivce.createCategoryRoom(createCategoryRoomDTO);
  }

  
}
