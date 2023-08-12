import { Controller, Get, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { CityService } from "./city.service";
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiResponse, ApiTags } from "@nestjs/swagger";
import { City } from "@prisma/client";
import { Roles } from "src/common/decorator";
import { MyJwtGuard } from "src/common/guard";
import { RolesGuard } from "src/common/guard/roles.guard";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { Public } from "src/common/decorator/public.decorator";
import { PaginationResult } from "src/common/interface/pagination.interface";

@Controller('city')
@ApiTags('City')
@ApiBearerAuth('JWT-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class CityController{
    constructor(
        private cityService: CityService
    ){}
    
    @ApiOperation({summary:"Get all city"})
  
    @Public()
    @Get()
    async getALlCity(
        @Query('page') page: number,
        @Query('perPage') perPage: number,
    ):Promise<PaginationResult<City>>{
        return await this.cityService.getCity(page,perPage )
    }

    @Public()
    @Get('getCityByCountry')
    async getCityByCountry(
        @Query('id') id: string,  
        @Query('page') page: number,
        @Query('perPage') perPage: number,):Promise<PaginationResult<City>>{
        return await this.cityService.getCityByCountryId(id, page, perPage)
    }
}