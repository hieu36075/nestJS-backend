// socket-action.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service'; // Thay thế đường dẫn thật

@Injectable()
export class SocketActionService {
  constructor(private prismaService: PrismaService) {}

  async createNotification(userId: string, data: any) {
    const notification = await this.prismaService.notification.create({
      data: {
        data: data,
        userId: userId,
      },
    });

    return notification;
  }

  // ... các phần khác của dịch vụ ...
}
