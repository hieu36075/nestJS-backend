import { Body, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Room } from '@prisma/client';
import { CreateRoomDTO } from './dto/create.room.dto';
import { UpdateRoomDTO } from './dto/update.room.dto';
@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  async getAllRoom():Promise<Room[]>{
    return await this.prismaService.room.findMany()
  }

  async getRoomById(id:string): Promise<Room>{
    const room = await this.prismaService.room.findUnique({
      where:{
        id: id
      }
    })

    if(room){
      throw new ForbiddenException('Please Check Data Again')
    }
    return room
  }

  async creteRoom(@Body() createRoomDTO: CreateRoomDTO): Promise<Room>{
    return await this.prismaService.room.create({
      data:{
        ...createRoomDTO,
      },
    });
  }

  async updateRoom(id: string, @Body() updateRoomDTO: UpdateRoomDTO): Promise<Room>{
    const room = await this.prismaService.room.findUnique({
      where:{
        id: id
      },
      include:{

      }
    });
    if(!room){
      throw new NotFoundException("Please Check Data Again")
    }

    return this.prismaService.room.update({
      where:{
        id: room.id
      },
      data:{
        ...updateRoomDTO
      }
    })
  }

  
}
