import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketActionService } from './socket-action.service';
import { PrismaService } from 'src/database/prisma/prisma.service'; // Thay thế đường dẫn thật
import { RedisService } from '@liaoliaots/nestjs-redis';
import * as cuid from 'cuid';
@Injectable()
@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private pingInterval: NodeJS.Timeout;

  constructor(
    private readonly redisService: RedisService,
    private socketActionService: SocketActionService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(socket: Socket) {
    // console.log("connect", socket.id)
    this.pingInterval = setInterval(() => {
      socket.emit('ping', { timestamp: new Date() });
    }, 30000);
    socket.on('join', async (userId) => {
      await this.saveUserSocketInfo(userId, socket.id);
    });
  }
  async handleDisconnect(socket: Socket) {
    try {
      // console.log(socket.id)
      await this.removeUserSocketInfo(socket.id);
      clearInterval(this.pingInterval);
    } catch (error) {
      console.error("Error while removing user socket info:", error);
    }
  }

  async saveUserSocketInfo(userId: string, socketId: string) {
    try {
      const savedSocketConnection = await this.socketActionService.saveSocketId(userId, socketId);
      // console.log('Socket connection saved:', savedSocketConnection);
    } catch (error) {
      console.error('Error saving socket connection:', error);
    }
    
  }

  async removeUserSocketInfo(socketId: string) {
    return await this.socketActionService.deleteSocketId(socketId)
  }

  async getUserIdBySocketId(socketId: string): Promise<any> {
    return await this.socketActionService.getUserByClient(socketId);
  }

  async getSocketByUserId(userId: string): Promise<any> {
    return await this.socketActionService.getClientByUser(userId)
  }

  async sendNotification(userId: string, action: string, description: string) {
    try {
      const socketId = await this.getSocketByUserId(userId);
      console.log(socketId)
      if (socketId) {
        const notificationData = {
          data: description,
          createdAt: new Date().toISOString(),
          id: cuid(),
          userId: userId,
        };
        this.server.to(socketId).emit('notification', notificationData);

        await this.socketActionService.createNotification(userId, description);
      }
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }
  }
}
