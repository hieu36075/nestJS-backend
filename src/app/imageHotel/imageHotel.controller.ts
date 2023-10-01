import { Body, Controller, Post } from "@nestjs/common";
import { ImageHotelService } from "./imageHotel.service";
import { CreateImageHotelDTO } from "./dto/imageHotel.create.dto";
import { ImageHotel } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";

@Controller('imageHotel')
@ApiTags('ImageHotel')
export class ImageHotelController{
    constructor(
        private imageHotelService: ImageHotelService
    ){}

    @Post()
    async createImageHotel(@Body() createImageHotelDTO: CreateImageHotelDTO): Promise<ImageHotel>{
        return await this.imageHotelService.createImage(createImageHotelDTO)
    }
}