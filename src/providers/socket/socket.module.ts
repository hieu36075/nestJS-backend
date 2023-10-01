import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketActionService } from './socket-action.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MessageService } from 'src/app/message/message.service';
import { RoomMessageService } from 'src/app/roomMessage/roomMessage.service';
import { UserRoomMessageService } from 'src/app/userRoomMessage/userRoomMessage.service';


@Global()
@Module({
  providers: [SocketGateway, SocketActionService, PrismaService, MessageService, RoomMessageService,UserRoomMessageService],
  exports: [SocketGateway, SocketActionService, PrismaService ],
})
export class SocketModule {}
