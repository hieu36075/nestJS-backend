import { Injectable } from "@nestjs/common";
import { Message } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class MessageService{
    constructor(
        private prismaService: PrismaService
    ){
        
    }
    async createMessage(content: string, userId: string, roomId: string):Promise<Message>{
        return await this.prismaService.message.create({
            data:{
                content: content,
                sederId: userId,
                roomId: roomId,
            }
        })
    }
}