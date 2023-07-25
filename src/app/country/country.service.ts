import { Injectable } from "@nestjs/common";
import { Country } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class CountryService{
    constructor(
        private prismaService:PrismaService,
    ){}

    async getCountry():Promise<Country[]>{
        return await this.prismaService.country.findMany()
    }

    async topCountriesWithMostHotels():Promise<Country[]>{
        return await this.prismaService.country.findMany({
            include: {
                hotels: true,
              },
              orderBy: {
                hotels: {
                    _count: 'desc',
                },
              },
              take: 3,
        })
    }

  
}