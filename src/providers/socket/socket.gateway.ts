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
import cuid from 'cuid';
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
    this.pingInterval = setInterval(() => {
      socket.emit('ping', { timestamp: new Date() });
    }, 30000);
    socket.on('join', async (userId) => {
      await this.saveUserSocketInfo(userId, socket.id);
    });
  }

  async handleDisconnect(socket: Socket) {
    await this.removeUserSocketInfo(socket.id);
    clearInterval(this.pingInterval);
  }

  async saveUserSocketInfo(userId: string, socketId: string) {
    // Lưu thông tin người dùng kết nối bằng Redis Sets
    await this.redisService.getClient().sadd(`user:${userId}`, socketId);

    // Lưu thông tin kết nối tới người dùng bằng Redis Sets
    await this.redisService.getClient().sadd(`socket:${socketId}`, userId);
  }

  async removeUserSocketInfo(socketId: string) {
    const userIds = await this.redisService
      .getClient()
      .smembers(`socket:${socketId}`);
    for (const userId of userIds) {
      await this.redisService.getClient().srem(`user:${userId}`, socketId);
    }

    await this.redisService.getClient().del(`socket:${socketId}`);
  }

  async getUserIdBySocketId(socketId: string): Promise<string | null> {
    const userIds = await this.redisService
      .getClient()
      .smembers(`socket:${socketId}`);
    if (userIds.length > 0) {
      return userIds[0];
    }
    return null;
  }

  async getSocketByUserId(userId: string): Promise<string | null> {
    const socketIds = await this.redisService
      .getClient()
      .smembers(`user:${userId}`);
    if (socketIds.length > 0) {
      return socketIds[0];
    }
    return null;
  }

  async sendNotification(userId: string, action: string, description: string) {
    try {
      const socketId = await this.getSocketByUserId(userId);
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
