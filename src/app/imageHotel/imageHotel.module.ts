import { Module } from "@nestjs/common";
import { ImageHotelController } from "./imageHotel.controller";
import { ImageHotelService } from "./imageHotel.service";

@Module({
    imports:[],
    controllers:[ImageHotelController],
    providers:[ImageHotelService]
})
export class ImageHotelModule{}