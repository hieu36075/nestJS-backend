import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketActionService } from './socket-action.service';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Global()
@Module({
  providers: [SocketGateway, SocketActionService, PrismaService],
  exports: [SocketGateway, SocketActionService, PrismaService],
})
export class SocketModule {}
