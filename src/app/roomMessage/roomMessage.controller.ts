import { Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { RoomMessageService } from "./roomMessage.service";
import { RoomMessage } from "@prisma/client";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetUser } from "src/common/decorator/user.decorator";
import { MyJwtGuard } from "src/common/guard";
import { RolesGuard } from "src/common/guard/roles.guard";

@Controller('roomMessage')
@ApiTags('RoomMessage')
@ApiBearerAuth('JWT-auth')
@UseGuards(MyJwtGuard,RolesGuard)

export class RoomMessageController{
    constructor(
        private roomMessageService: RoomMessageService
    ){}
    

    @Get()
    async getAll():Promise<RoomMessage[]>{
        return await this.roomMessageService.getAll()
    }

    @Get('by-userId')
    async getByUserId(@GetUser('id')userId: string): Promise<RoomMessage[]>{
        return await this.roomMessageService.getByUserId(userId)
    }
    
    @Get('check-room')
    async checkRoom(@Query('senderId') senderId: string, @Query('receiveId') receiveId: string):Promise<RoomMessage | null>{
        return await this.roomMessageService.checkRoom(senderId, receiveId)
    }
    
    @Get(':id')
    async getById(@Param('id')id: string):Promise<RoomMessage>{
        return await this.roomMessageService.getById(id)
    }
}