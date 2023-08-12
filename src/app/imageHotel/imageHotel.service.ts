import { Body, ForbiddenException, Injectable } from "@nestjs/common";
import { ImageHotel } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateImageHotelDTO } from "./dto/imageHotel.create.dto";

@Injectable()
export class ImageHotelService{
    constructor(
        private prismaService: PrismaService
    ){}

    async createImage(@Body() createImageHotelDTO: CreateImageHotelDTO): Promise<ImageHotel>{
        const hotel = await this.prismaService.hotel.findUnique({
            where:{
                id: createImageHotelDTO.hotelId
            }
        })

        if(!hotel){
            throw new ForbiddenException('please check aggain')
        }

        return await this.prismaService.imageHotel.create({
            data:{
                ...createImageHotelDTO
            }
        })
    }
}