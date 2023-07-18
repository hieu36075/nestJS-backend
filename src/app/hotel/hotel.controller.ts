import { Controller, Get, Post, Patch, Query, Delete, UseGuards, Body, Param, HttpCode, HttpStatus, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { MyJwtGuard } from "src/common/guard";
import { HotelService } from "./hotel.service";
import { Hotel } from "@prisma/client";
import { CreateHotelDTO } from "./dto/create.hotel.dto";
import { UpdateHotelDTO } from "./dto/update.hotel.dto";
import { Roles } from "src/common/decorator";
import { RolesGuard } from "src/common/guard/roles.guard";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { PaginationResult } from "src/common/interface/pagination.interface";
import { Public } from "src/common/decorator/public.decorator";

@Controller('hotel')
@ApiTags('Hotel')
@ApiBearerAuth('JWT-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class HotelController{
    constructor(
        private readonly hotelService: HotelService
    ){}
    

    @Public()
    @Get()
    async getAll(@Query('page') page: number,@Query('perPage') perPage: number) : Promise<PaginationResult<Hotel>>{
        return await this.hotelService.getHotel(page, perPage)
    }


    @Get(':id')
    async getById(@Param('id') hotelId : string): Promise<Hotel | null>{
        return await this.hotelService.getHotelById(hotelId)
    }


    @Post()
    async createHotel(@Body() craeteHotelDTO:CreateHotelDTO): Promise<Hotel>{
        return await this.hotelService.createHotel(craeteHotelDTO)
    }


    @Patch()
    async updateHotel(@Query('id') hotelId : string ,@Body() updateHotelDTO: UpdateHotelDTO): Promise<Hotel | null>{
        return await this.hotelService.updateHotel(hotelId, updateHotelDTO);
    } 


    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    async deleteHotel(@Query('id') hotelId: string): Promise<void>{
        return this.hotelService.deleteHotel(hotelId);
    }
    
}