import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { City } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateCitylDTO } from "./dto/create.city.dto";
import { UpdateCitylDTO } from "./dto/update.city.dto";

@Injectable()
export class CityService{
    constructor(
        private prismaService: PrismaService
    ){}

    async getCity():Promise<City[]>{
        return this.prismaService.city.findMany()
    }

    async getCityById(cityId: string): Promise<City>{
        return this.prismaService.city.findUnique({
            where:{
                id: cityId
            }
        })
    }

    async createCity(@Body() createCityDTO: CreateCitylDTO): Promise<City>{
        return this.prismaService.city.create({
            data:{
                ...createCityDTO
            }
        })
    }

    async updateCity(cityId: string,@Body() updateCityDTO: UpdateCitylDTO): Promise<City>{
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