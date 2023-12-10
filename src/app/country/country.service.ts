import { Body, Injectable } from '@nestjs/common';
import { Country } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateCountryDTO } from './dto/create.country.dto';
import { PaginationResult } from 'src/common/interface/pagination.interface';

@Injectable()
export class CountryService {
  constructor(private prismaService: PrismaService) {}

  async getCountry(page:number, perPage: number): Promise<PaginationResult<Country>> {
    const totalItems = await this.prismaService.hotel.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);
    const data = await this.prismaService.country.findMany(
      {
        skip,
        take,
      }
    );

    const meta = { page, perPage, totalItems, totalPages };

    return { data, meta };
  }

  async topCountriesWithMostHotels(page:number, perPage: number): Promise<PaginationResult<Country>> {
    const totalItems = await this.prismaService.hotel.count();
    const totalPages = Math.ceil(totalItems / perPage);
    const skip = (page - 1) * perPage;
    const take = parseInt(String(perPage), 10);
    const data = await this.prismaService.country.findMany({
      
      include: {
        hotels: true,
      },
      orderBy: {
        hotels: {
          _count: 'desc',
        },
      },
      skip,
      take,
    });
    const meta = { page, perPage, totalItems, totalPages };

    return { data, meta };
  }

  async createCountry(createCountryDTO: CreateCountryDTO): Promise<Country>{
    return await this.prismaService.country.create({
      data:{
        ...createCountryDTO
      }
    })
  }
}
