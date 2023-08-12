import { Body, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { City } from "@prisma/client";
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateCitylDTO } from "./dto/create.city.dto";
import { UpdateCitylDTO } from "./dto/update.city.dto";
import { PaginationResult } from "src/common/interface/pagination.interface";

@Injectable()
export class CityService{
    constructor(
        private prismaService: PrismaService
    ){}

    async getCity(page:number, perPage: number):Promise<PaginationResult<City>> {
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10);
        const data = await this.prismaService.city.findMany(
          {
            skip,
            take,
          }
        );
    
        const meta = { page, perPage, totalItems, totalPages };
    
        return { data, meta };
    }

    async getCityByCountryId(countryId: string, page:number, perPage: number):Promise<PaginationResult<City>>{
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10);
        const country = await this.prismaService.country.findUnique({
            where:{
                id:countryId
            }
        })

        if(!country){
            throw new ForbiddenException("Please check Again")
        }
        const data = await this.prismaService.city.findMany({
            skip,
            take,
            where:{
                countryId: countryId
            },
            
        })
        const meta = { page, perPage, totalItems, totalPages };
    
        return { data, meta };
    }

    async getCityById(cityId: string): Promise<City | null>{
        const city = this.prismaService.city.findUnique({
            where:{
                id: cityId
            },
            
        })
        if(!city){
            throw new ForbiddenException('Cannot find Hotel in Database');
        }
        return city
    }

    async createCity(@Body() createCityDTO: CreateCitylDTO): Promise<City>{
        return this.prismaService.city.create({
            data:{
                ...createCityDTO
            }
        })
    }

    async updateCity(cityId: string,@Body() updateCityDTO: UpdateCitylDTO): Promise<City | null>{
        const city = await this.prismaService.city.findUnique({
            where:{
                id: cityId
            }
        })
        if(!city){
            throw new NotFoundException("Please Check Data Again")
        }
        return this.prismaService.city.update({
            where:{
                id: city.id
            },
            data:{
                ...updateCityDTO
            }
        })
    }
}