import { Injectable } from "@nestjs/common";
import { UserRoomMessage } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class UserRoomMessageService{
    constructor(
        private prismaService: PrismaService
    ){
        
    }

    async getAll():Promise<UserRoomMessage[]>{
        return await this.prismaService.userRoomMessage.findMany()
    }
    
    async findById(id: string):Promise<UserRoomMessage>{
        return await this.prismaService.userRoomMessage.findFirstOrThrow({
            where:{
                userId: id
            }
        })
    }

    async create(userId: string, roomId: string): Promise<UserRoomMessage>{
        return await this.prismaService.userRoomMessage.create({
            data:{
                userId: userId,
                roomId: roomId,
            }
        })
    }

}