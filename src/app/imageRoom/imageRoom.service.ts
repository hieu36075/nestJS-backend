import { Body, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateImageRoomDTO } from "./dto/imageRoom.create.dto";
import { ImageRoom } from "@prisma/client";

@Injectable()
export class ImageRoomService{
    constructor(
        private prismaService: PrismaService
    ){}

    async createImage(@Body() createImageRoomDTO: CreateImageRoomDTO): Promise<ImageRoom>{
        const hotel = await this.prismaService.room.findUnique({
            where:{
                id: createImageRoomDTO.roomId
            }
        })

        if(!hotel){
            throw new ForbiddenException('please check aggain')
        }

        return await this.prismaService.imageRoom.create({
            data:{
                ...createImageRoomDTO
            }
        })
    }
}