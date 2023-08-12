import { Body, Controller, Get, Post } from "@nestjs/common";
import { ImageRoomService } from "./imageRoom.service";
import { ImageRoom } from "@prisma/client";
import { CreateImageRoomDTO } from "./dto/imageRoom.create.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller('imageRoom')
@ApiTags('ImageRoom')
export class ImageRoomController{
    constructor(
        private imageRoomService: ImageRoomService
    ){}

    @Post()
    async createImageRoom(@Body() createImageRoomDTO: CreateImageRoomDTO):Promise<ImageRoom>{
        console.log(createImageRoomDTO)
        return await this.imageRoomService.createImage(createImageRoomDTO)
    }
}