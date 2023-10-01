import { Module } from "@nestjs/common";
import { RoomMessageController } from "./roomMessage.controller";
import { RoomMessageService } from "./roomMessage.service";

@Module({
    imports:[],
    controllers:[RoomMessageController],
    providers:[RoomMessageService],
    exports:[RoomMessageService]
})
export class RoomMessageModule{} 