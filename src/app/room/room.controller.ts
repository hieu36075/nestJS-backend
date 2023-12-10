import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomService } from './room.serice';
import { Room } from '@prisma/client';
import { CreateRoomDTO } from './dto/create.room.dto';
import { UpdateRoomDTO } from './dto/update.room.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator';
import { MyJwtGuard } from 'src/common/guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Public } from 'src/common/decorator/public.decorator';
@Controller('room')
@ApiTags('Room')
@ApiBearerAuth('JWT-auth')
@Roles('User')
@UseGuards(MyJwtGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
export class RoomController {
  constructor(private roomService: RoomService) {}


  @Get()
  async getAll():Promise<Room[]>{
    return await this.roomService.getAllRoom();
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') roomId: string): Promise<Room | null>{
    return await this.roomService.getRoomById(roomId);
  }

  @Roles('Hotel Owner')
  @Post()
  async createRoom(@Body() createRoomDTO: CreateRoomDTO): Promise<Room | null>{
    return await this.roomService.creteRoom(createRoomDTO);
  }
  @Roles('Hotel Owner')
  @Patch(':id')
  async updateRoom(@Param('id') roomId: string,@Body() updateRoomDto: UpdateRoomDTO): Promise<Room | null>{
    return await this.roomService.updateRoom(roomId, updateRoomDto);
  }
  
  @Roles('Hotel Owner')
  @Delete()
  async deleteRoom(@Query('id') id:string) : Promise<void>{
    return await this.roomService.deleteRoom(id);
  }
}
