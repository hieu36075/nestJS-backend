import { Body, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Country, Hotel } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateHotelDTO } from "./dto/create.hotel.dto";
import { UpdateHotelDTO } from "./dto/update.hotel.dto";
import { PaginationResult } from "src/common/interface/pagination.interface";
import { GetHotelFilterDTO } from "./dto/getfilter.hotel.dto";

@Injectable()
export class HotelService{
    constructor(
        private prismaService: PrismaService,
        ){
    }


    async getHotel(page: number, perPage: number):Promise<PaginationResult<Hotel>>{
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10)
        const data = await this.prismaService.hotel.findMany({
            skip,
            take,
            include: {
              room: true,
              comment: true,
              amenities: true,
              images:{
                select:{
                    url:true
                }
              }
            },
          });

        const meta = {page,perPage,totalItems,totalPages}

        return {data,meta};
    }

    async getHotelById(hotelId: string): Promise<Hotel | null> {
        const hotel = await this.prismaService.hotel.findUnique({
          where: {
            id: hotelId, // Truyền giá trị của hotelId vào đây
          },
        });

        if(!hotel){
            throw new ForbiddenException("Invalid Id ")
        }
        
        return hotel
      }

    async createHotel(@Body() createHotelDTO : CreateHotelDTO):Promise<Hotel>{
        return await this.prismaService.hotel.create({
            data:{
                ...createHotelDTO,
            }
        })
    }

    async updateHotel(hotelId: string, @Body() updateHotelDTO : UpdateHotelDTO): Promise<Hotel>{
        const hotel = await this.prismaService.hotel.findUnique({
            where:{
                id: hotelId
            },
        })

        if(!hotel){
            throw new ForbiddenException('Cannot find Hotel in Database')
        }

        return this.prismaService.hotel.update({
            where:{
                id:hotelId
            },
            data:{
                ...updateHotelDTO
            }
        })
    }

    async deleteHotel(hotelId:string): Promise<void>{
        await this.prismaService.hotel.delete({
            where:{
                id: hotelId
            }
        })
    }

    async getHotelByCountry(countryId: string): Promise<any>{
      return  await this.prismaService.hotel.findMany({
            where:{
                countryId: countryId
            },
            include:{
                images:true,
            }
        })
    }
    
    async getHotelByCategory(categoryId : string): Promise<any>{
        return await this.prismaService.hotel.findMany({
            where:{
                categoryId: categoryId
            }, include:{
                images:true
            }
        })
    }

    async getHotelByFilter(getHotelByFilter: GetHotelFilterDTO):Promise<any>{
        const where = this.buildFilterConditions(getHotelByFilter);

        return await this.prismaService.hotel.findMany({
            where
        });
    }

    private buildFilterConditions(filter: GetHotelFilterDTO) {
        const { name, address, countryId, starRating, categoryId } = filter;
        const where: any = {};
    
        if (name) where['name'] = { contains: name };
        if (address) where['address'] = address;
        if (countryId) where['countryId'] = countryId;
        if (starRating !== undefined) where['starRating'] = starRating;
        if (categoryId) where['categoryId'] = categoryId;
    
        return where;
      }
}