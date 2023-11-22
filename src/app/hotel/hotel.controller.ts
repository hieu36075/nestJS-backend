import {
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Delete,
  UseGuards,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  ParseBoolPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/common/guard';
import { HotelService } from './hotel.service';
import { Hotel } from '@prisma/client';
import { CreateHotelDTO } from './dto/create.hotel.dto';
import { UpdateHotelDTO } from './dto/update.hotel.dto';
import { Roles } from 'src/common/decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { PaginationResult } from 'src/common/interface/pagination.interface';
import { Public } from 'src/common/decorator/public.decorator';
import { GetHotelFilterDTO } from './dto/getfilter.hotel.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/common/decorator/user.decorator';

@Controller('hotel')
@ApiTags('Hotel')
@ApiBearerAuth('JWT-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Public()
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<PaginationResult<Hotel>> {
    return await this.hotelService.getHotel(page, perPage);
  }

  @Public()
  @Get('/search')
  async Search(
    @Query('countryId') countryId?: string,
    @Query('name') name?: string,
    @Query('categoryId') categoryId?: string,
    @Query('occupancy') occupancy?: number, 
    @Query('minPrice') minPrice?: number, 
    @Query('maxPrice') maxPrice?: number, 
  ): Promise<any> {
    return await this.hotelService.getHotelByFilter({
      countryId,
      name,
      categoryId,
      occupancy,
      minPrice,
      maxPrice
    });
  }

  @Public()
  @Get('/get-hotel-by-room')
  async getHotelByRoom(@Query('hotelId') hotelId: string, @Query('roomId') roomId: string):Promise<Hotel>{
    return this.hotelService.getHotelByRoomId(hotelId, roomId)
  }

  @Roles('User', 'Hotel Owner')
  @Get('/get-by-user')
  async getHotelByUserId(
    @GetUser('id') id: string, 
    @Query('page') page:number, 
    @Query('perPage') perPage:number){
    return await this.hotelService.getHotelByUser(id, page, perPage)
  }

  @Get('/filter-by-user')
  async filterHotelByUserId(
    @GetUser('id') id: string, 
    @Query('active',ParseBoolPipe) active : boolean
    ){
    return await this.hotelService.filterHotelByUserId(id, active)
  }


  @Public()
  @Get(':id')
  async getById(@Param('id') hotelId: string): Promise<Hotel | null> {
    return await this.hotelService.getHotelById(hotelId);
  }
  @Roles('Hotel Owner')
  @Get(':hotelId/users')
  async getUsersForHotel(@Param('hotelId') hotelId: string,  @Query('page') page: number,
  @Query('perPage') perPage: number, ) {
    return this.hotelService.getUsersForHotel(hotelId, page ,perPage);
  }


  @Public()
  @Get('/get-hotel-by-country/:id')
  async getHotelByCountry(@Param('id') countryId: string): Promise<any> {
    return await this.hotelService.getHotelByCountry(countryId);
  }

  @Public()
  @Get('/get-hotel-by-category/:id')
  async getHotelByCategory(@Param('id') categoryId: string): Promise<any> {
    return await this.hotelService.getHotelByCategory(categoryId);
  }
  
  @Roles('Hotel Owner')
  @Get('/:hotelId/user-in-month')
  async getReservationsCountByHotel(
    @Param('hotelId') hotelId: string,
  ): Promise<number[]> {

    return await this.hotelService.getReservationsCountByHotel(hotelId);


  }

  @Roles('Hotel Owner')
  @Patch('/active-hotel')
  async activeHotel(@Query('id') id: string):Promise<Hotel|null>{
    return await this.hotelService.activeHotel(id)
  }
  // @Public()
  // @Get('/get-hotel-by-room')
  // async getHotelByRoom(@Query('hotelId') hotelId: string, @Query('roomId') roomId: string): Promise<any> {
  //   return await this.hotelService.getHotelByRoomId(categoryId);
  // }
  

  @Roles('Hotel Owner')
  @Post()
  async createHotel(@GetUser('id') id: string, @Body() craeteHotelDTO: CreateHotelDTO): Promise<Hotel> {
    return await this.hotelService.createHotel(id, craeteHotelDTO);
  }

  @Roles('Hotel Owner')
  @Patch()
  async updateHotel(
    @Query('id') hotelId: string,
    @Body() updateHotelDTO: UpdateHotelDTO,
  ): Promise<Hotel | null> {
    return await this.hotelService.updateHotel(hotelId, updateHotelDTO);
  }

  @Roles('User', 'Hotel Owner')
  @Public()
  @Post('/multiple-file-upload')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    return await this.hotelService.multiUpload(files);
  }

  @Roles('Hotel Owner')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteHotel(@Query('id') hotelId: string): Promise<void> {
    return this.hotelService.deleteHotel(hotelId);
  }
}
