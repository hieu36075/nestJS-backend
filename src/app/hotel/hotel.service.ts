import { Body, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Country, Hotel } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateHotelDTO } from "./dto/create.hotel.dto";
import { UpdateHotelDTO } from "./dto/update.hotel.dto";
import { PaginationResult } from "src/common/interface/pagination.interface";

@Injectable()
export class HotelService{
    constructor(
        private prismaService: PrismaService,
        ){
    }

    async paginationPage():Promise<any>{

    }
    async getHotel(page: number, perPage: number):Promise<PaginationResult<Hotel>>{
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10)
        const data = await this.prismaService.hotel.findMany({
            skip,
            take,
            include:{
                room:true
            }
        })

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
                ...createHotelDTO
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
}