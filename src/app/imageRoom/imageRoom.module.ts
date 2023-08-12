import { Module } from "@nestjs/common";
import { ImageRoomController } from "./imageRoom.controller";
import { ImageRoomService } from "./imageRoom.service";

@Module({
    imports:[],
    controllers:[ImageRoomController],
    providers:[ImageRoomService]
})
export class ImageRoomModule{}