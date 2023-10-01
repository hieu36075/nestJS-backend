import { Module } from "@nestjs/common";
import { UserRoomMessageController } from "./userRoomMessage.controller";
import { UserRoomMessageService } from "./userRoomMessage.service";


@Module({
    imports:[],
    controllers:[UserRoomMessageController],
    providers:[UserRoomMessageService],
    exports:[UserRoomMessageService]
})
export class userRoomMessageModule{} 