import { ForbiddenException, Injectable } from "@nestjs/common";
import { RoomMessage } from "@prisma/client";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class RoomMessageService{
    constructor(
        private prismaService: PrismaService
    ){  
    }
    async getAll():Promise<RoomMessage[]>{
        return await this.prismaService.roomMessage.findMany({
            include:{
                userRoomMessage:true,
                message: true
            }
        })
    }

    async getById(id: string): Promise<RoomMessage>{
        const roomMessage = await this.prismaService.roomMessage.findUnique({
            where:{
                id: id
            },
            include:{
                message:true,
                userRoomMessage: true
            }
        })

        return roomMessage
    }
    async getByUserId(userId: string):Promise<RoomMessage[]>{
        const roomMessages= await this.prismaService.roomMessage.findMany({
            where:{
                userRoomMessage:{
                    some:{ 
                        userId: userId
                    }
                }
            },
            include:{
                userRoomMessage:true,
                message: {
                    orderBy:{
                        createAt: 'desc'
                    },
                    take:1
                }
            },

        }) || [];

        roomMessages.sort((a, b) => {
            if (!a.message [0]) return 1;  // Phòng a không có tin nhắn, đưa lên cuối
            if (!b.message [0]) return -1;  // Phòng b không có tin nhắn, đưa lên cuối
        
            return a.message [0].createAt > b.message [0].createAt ? -1 : 1;
          });

        const filteredRoomMessages = roomMessages.map(roomMessage => ({
            ...roomMessage,
            userRoomMessage: roomMessage.userRoomMessage.filter(userMsg => userMsg.userId !== userId)
          }));

          return filteredRoomMessages;
    }

    async checkRoom(senderId: string, receivedId: string):Promise<RoomMessage | null>{
        const room =  await this.prismaService.roomMessage.findFirst({
            where:{
                userRoomMessage:{
                   every:{
                    userId:{
                        in: [senderId, receivedId]
                    }
                   }
                }
            }
        }) 
        return room || null
    }

    async createRoom(): Promise<RoomMessage>{
        return await this.prismaService.roomMessage.create({
            data:{
                userRoomMessage:{connect:[]},
                message:{connect:[]}
            }
        })
    }
    async createRoomMessage(userId: string, roomId: string):Promise<RoomMessage>{
        return await this.prismaService.roomMessage.create({
            data:{
                message:{
                    connect:{
                        id: userId
                    },
                },
                userRoomMessage:{
                    connect:{
                        id: roomId
                    }
                }
            }
        })
    }

    async checkRoomId(id: string) : Promise<RoomMessage>{
        return await this.prismaService.roomMessage.findUnique({
            where:{
                id: id
            },
            include:{
                message:true,
                userRoomMessage:true
            }
        })
    }
}